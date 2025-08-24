"use server";


import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route"; // adjust the path if needed
import { prisma } from "@/server/db";

export async function fetchResumes() {
  try {
    // ✅ Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized: User not logged in");
    }

    // ✅ Fetch resumes from DB
    let resumes;
    try {
      resumes = await prisma.resume.findMany({
        where: { userId: session.user.id },
        orderBy: { uploadedAt: "desc" },
        take: 5,
      });
    } catch (dbError) {
      console.error("Database error while fetching resumes:", dbError);
      throw new Error("Failed to fetch resumes from database");
    }

    return resumes;
  } catch (error) {
    console.error("Error in fetchResumes:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
