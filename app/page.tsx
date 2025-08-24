// app/page.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession(); // get user session

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-3xl text-center space-y-8">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight text-black">
          Resume Analyzer
        </h1>

        {/* Subtext */}
        <p className="text-lg text-black max-w-xl mx-auto">
          Get your resume scored out of 100, discover improvement areas, and
          access LaTeX snippets to upgrade your resume instantly.
        </p>

        {/* Show Sign-in Button only if NOT signed in */}
        {!session && (
          <div className="flex items-center justify-center pt-6">
            <a
              href="/signin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-black/90 transition"
            >
              Sign in with Google <ArrowRight size={18} />
            </a>
          </div>
        )}
      </div>

      {/* Features Section */}
      <section
        id="features"
        className="max-w-5xl mx-auto mt-24 grid sm:grid-cols-3 gap-8 text-center"
      >
        <div className="p-6 rounded-xl border border-black">
          <h3 className="text-xl font-bold mb-2 text-black">Smart Scoring</h3>
          <p className="text-sm text-black">
            Your resume is scored across structure, keywords, ATS compatibility,
            and more.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-black">
          <h3 className="text-xl font-bold mb-2 text-black">
            Actionable Insights
          </h3>
          <p className="text-sm text-black">
            Get clear suggestions on what to add, remove, or improve in your
            resume.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-black">
          <h3 className="text-xl font-bold mb-2 text-black">LaTeX Snippets</h3>
          <p className="text-sm text-black">
            Ready-to-use LaTeX code snippets so you can upgrade your resume
            immediately.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-sm text-black border-t border-black pt-6">
        © {new Date().getFullYear()} Resume Analyzer. All rights reserved.
      </footer>
    </main>
  );
}
