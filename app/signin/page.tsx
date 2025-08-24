"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button"; // shadcn button
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl border border-black">
        {/* Logo / App Name */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-black">
            Resume Analyzer
          </h1>
          <p className="mt-2 text-black">
            Get insights & improve your resume with AI
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-black"></div>

        {/* Sign In Button */}
        <Button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 py-6 text-base font-semibold rounded-xl border border-black bg-black text-white hover:bg-white hover:text-black transition"
        >
          <FcGoogle size={22} />
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
