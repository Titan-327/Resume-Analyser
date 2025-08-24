"use server";


import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/server/db";

export async function fetchResumeById(resumeId: string) {
  try {
    // ✅ Get logged-in user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized: User not logged in");
    }

    // ✅ Fetch the resume that belongs to this user
    let resume;
    try {
      resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: session.user.id, // Ensure user only fetches their own resume
        },
      });
    } catch (dbError) {
      console.error("Database error while fetching resume:", dbError);
      throw new Error("Failed to fetch resume from database");
    }

    if (!resume) {
      throw new Error("Resume not found or access denied");
    }

    return resume;
  } catch (error) {
    console.error("Error in fetchResumeById:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
