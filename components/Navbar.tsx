"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-black">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl sm:text-2xl font-bold text-black">
          ResumeAnalyzer
        </Link>

        {/* Desktop Nav (black underline effect) */}
        <div className="hidden lg:flex items-center space-x-10">
          {["Dashboard", "About"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="relative text-sm font-semibold text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <div className="hidden md:flex items-center space-x-2">
              <Avatar className="h-9 w-9 border border-black">
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback className="bg-white text-black font-bold">
                  {session.user.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => signOut()}
                className="text-sm font-semibold text-black"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="hidden md:inline-block bg-black text-white hover:bg-black px-5 py-2 text-sm font-semibold rounded-lg"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="relative z-[101] flex flex-col justify-between w-5 h-4 lg:hidden"
            onClick={() => setIsOpen(true)}
          >
            <span className="block h-[2px] w-full bg-black" />
            <span className="block h-[2px] w-full bg-black" />
            <span className="block h-[2px] w-full bg-black" />
          </button>
        </div>
      </div>

      {/* Floating Mobile Tab */}
      <div
        className={`fixed top-3 right-4 w-52 bg-white border border-black rounded-lg shadow-lg transform transition-transform duration-300 z-[200] ${
          isOpen ? "translate-x-0" : "translate-x-[120%]"
        } lg:hidden`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-black">
          <span className="text-base font-bold text-black">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-lg font-bold text-black"
          >
            ×
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col p-4 space-y-4 text-black text-sm font-semibold">
          {["Dashboard", "About"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="hover:underline"
            >
              {item}
            </Link>
          ))}

          {!session?.user && (
            <Button
              onClick={() => {
                setIsOpen(false);
                signIn("google", { callbackUrl: "/dashboard" });
              }}
              className="bg-black text-white hover:bg-black px-4 py-2 text-sm font-semibold rounded-lg"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/0 z-[150] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
}
