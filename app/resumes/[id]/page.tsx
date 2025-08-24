"use client";

import { fetchResumeById } from "@/app/actions/fetchResumeById";
import { useEffect, useState, use } from "react";

/* === MAIN COMPONENT === */
export default function ResumeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ unwrap params with React.use()
  const { id } = use(params);

  const [resume, setResume] = useState<any>(null);
  const [latexSections, setLatexSections] = useState<Record<string, string>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch resume once on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchResumeById(id);
        setResume(data);

        if ("latex" in data) {
          try {
            setLatexSections(JSON.parse(String(data?.latex ?? "{}")));
          } catch (jsonErr) {
            console.error("JSON Parse Error:", jsonErr);
            setLatexSections({});
          }
        } else {
          setLatexSections({});
        }
      } catch (err: any) {
        console.error("Error fetching resume:", err);
        setError(err.message || "Failed to fetch resume.");
      }
    }

    loadData();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold text-lg">
        ❌ {error}
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading resume details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <div className="max-w-5xl mx-auto space-y-16 border border-black p-12 rounded-2xl shadow-2xl">
        {/* === HEADER === */}
        <header className="space-y-4 border-b border-black pb-8">
          <h1
            className="text-2xl sm:text-5xl font-extrabold tracking-tight truncate"
            title={resume.name}
          >
            {resume.name}
          </h1>
          <div className="grid grid-cols-2 gap-y-2 text-lg font-medium">
            <p>
              <span className="font-bold">Uploaded:</span>{" "}
              {new Date(resume.uploadedAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-bold">Score:</span> {resume.score}
            </p>
          </div>
        </header>

        {/* === ANALYSIS === */}
        <section className="space-y-10">
          <h2 className="text-3xl font-bold border-b border-black pb-3">
            Resume Analysis
          </h2>

          {/* Issues */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold">Issues Found</h3>
            {resume.issues ? (
              <ul className="list-disc list-inside space-y-2">
                {resume.issues.split("\n").map((line: string, idx: number) => (
                  <li key={idx} className="font-medium leading-relaxed">
                    {line.replace(/^- /, "")}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-600">No issues available.</p>
            )}
          </div>

          {/* Improvements */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold">Improvements</h3>
            {resume.improvements ? (
              <ul className="list-disc list-inside space-y-2">
                {resume.improvements
                  .split("\n")
                  .map((line: string, idx: number) => (
                    <li key={idx} className="font-medium leading-relaxed">
                      {line.replace(/^- /, "")}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="italic text-gray-600">No improvements available.</p>
            )}
          </div>
        </section>

        {/* === LATEX SECTIONS === */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold border-b border-black pb-3">
            Extracted LaTeX
          </h2>
          <div className="space-y-6">
            {Object.entries(latexSections).map(([section, code]) => (
              <LatexBlock key={section} section={section} code={code} />
            ))}

            {Object.keys(latexSections).length === 0 && (
              <p className="italic text-gray-600">No LaTeX data available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* === COLLAPSIBLE LATEX BLOCK COMPONENT === */
function LatexBlock({ section, code }: { section: string; code: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-black rounded-xl overflow-hidden shadow-md transition-all">
      <button
        onClick={() => {
          try {
            setOpen(!open);
          } catch (err) {
            console.error("Toggle error:", err);
          }
        }}
        className="w-full flex justify-between items-center px-6 py-4 text-left font-bold uppercase tracking-wide text-lg hover:bg-black hover:text-white transition-all"
      >
        {section}
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="bg-gray-50 border-t border-black text-sm p-6 leading-relaxed overflow-x-auto">
          <code className="whitespace-pre font-mono font-semibold">{code}</code>
        </div>
      )}
    </div>
  );
}
