"use server";


import { pdfToText } from "pdf-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from "jsonrepair";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/server/db";

export async function processResume(file: File) {
  try {
    // ✅ Get logged-in user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }
    const userId = session.user.id;

    // ✅ Resume name from file
    const resumeName = file.name;
    console.log("Processing resume:", resumeName);

    // Convert uploaded File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text
    const text = await pdfToText(buffer);

    // Quick sanity check: extremely short docs are unlikely to be resumes
    if (!text || text.trim().length < 200) {
      return {
        success: false,
        notResume: true,
        message:
          "The uploaded file does not appear to be a resume (too little readable text). Please upload a valid resume PDF.",
      };
    }

    // Init Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build prompt with strict classification first
    // Build prompt with stricter classification rules
const prompt = `You are ResumeAnalyzer, a meticulous technical resume reviewer.

First, determine if the INPUT RESUME TEXT is a professional resume.

A valid resume must contain AT LEAST TWO of these common sections:
- Education
- Experience (Work Experience, Internships)
- Projects
- Skills
- Achievements

A document is NOT a resume if it looks like: essays, articles, books, code dumps, receipts, invoices, transcripts, certificates, legal contracts, or random notes.
Ignore missing formatting, broken bullets, or hyperlinks caused by PDF parsing.

If the document does NOT qualify as a resume (less than two valid sections found), respond ONLY with strict JSON:
{
  "notResume": true,
  "message": "The uploaded file does not appear to be a resume (it does not include at least two standard sections). Please upload a valid resume."
}

If it IS a resume, follow the tasks below and respond ONLY with the resume-analysis JSON defined under OUTPUT FORMAT (no extra keys, no Markdown, no comments).

## TASKS (Only if it is a resume)
1. Reorder & rewrite resume draft:
   - Reconstruct sections: Education, Experience, Projects, Skills, Achievements.
   - Order entries chronologically (latest first).
   - Rewrite entries concisely.
   - Remove duplicates and irrelevant artifacts.
   - Do not fabricate or hallucinate facts not present in the input.

## ANALYSIS
Provide a score out of 100 (string, e.g., "82/100").

Return analysis in two separate fields without section titles:
- "issues": bullet points only (no heading).
- "improvements": bullet points only (no heading).

### Rules for Issues
- Each point should be a bullet.
- Provide a short title followed by a detailed explanation (3–4 sentences).
- Focus on clarity, relevance, missing achievements, weak descriptions, or missing technical details.
- Do NOT include issues caused by PDF parsing such as formatting/layout errors, broken bullets, or missing hyperlinks.

### Rules for Improvements
- Each point should be a bullet.
- Provide specific, actionable improvements with 2–3 sentence explanations.
- Highlight actions as plain words (e.g., Quantify results, Emphasize skills).
- Do NOT suggest fixes for formatting, layout, or hyperlink issues.

## LATEX RESUME SNIPPETS
Generate LaTeX for each section (education, experience, projects, skills, achievements).
Escape reserved characters.

## OUTPUT FORMAT (use EXACTLY this shape for valid resumes)
{
  "score": "string",
  "issues": "string with bullet points only",
  "improvements": "string with bullet points only",
  "latex": {
    "education": "string",
    "experience": "string",
    "projects": "string",
    "skills": "string",
    "achievements": "string"
  }
}

## INPUT RESUME TEXT
"""
${text}
"""
`;


    // Gemini request
    const result = await model.generateContent(prompt);
    let raw = result.response.text();

    // Extract JSON from model output
    let match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      // No JSON returned — treat as failure (do not save)
      return {
        success: false,
        message: "Failed to parse analysis from the model.",
      };
    }
    let candidate = match[0];

    // Parse with repair fallback
    let parsed: any;
    try {
      parsed = JSON.parse(candidate);
    } catch {
      try {
        parsed = JSON.parse(jsonrepair(candidate));
      } catch {
        return {
          success: false,
          message: "Failed to parse analysis JSON.",
        };
      }
    }

    // ✅ If model classified as NOT a resume → do NOT write to DB
    if (parsed?.notResume === true) {
      return {
        success: false,
        notResume: true,
        message:
          parsed.message ||
          "The uploaded file does not appear to be a resume. Please upload a valid resume.",
      };
    }

    // ✅ Expect valid resume analysis shape
    const score = typeof parsed?.score === "string" ? parsed.score : undefined;
    const issues =
      typeof parsed?.issues === "string" ? parsed.issues : undefined;
    const improvements =
      typeof parsed?.improvements === "string" ? parsed.improvements : undefined;
    const latex =
      parsed?.latex && typeof parsed.latex === "object" ? parsed.latex : {};

    if (!score || !issues || !improvements) {
      // Missing mandatory fields — treat as failure (do not save)
      return {
        success: false,
        message:
          "The analysis response was incomplete. Please try again with a clearer resume PDF.",
      };
    }

    // ✅ Save only for valid resumes with valid analysis
    const resume = await prisma.resume.create({
      data: {
        userId,
        name: resumeName,
        score,
        issues,
        improvements,
        latex: JSON.stringify(latex),
      },
    });

    return { success: true, resume };
  } catch (error) {
    console.error("Error processing resume:", error);
    return { success: false, message: "Failed to process resume" };
  }
}
