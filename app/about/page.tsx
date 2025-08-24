// app/about/page.tsx
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center px-6 py-16">
      {/* Heading */}
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight">About Us</h1>
        <p className="text-lg leading-relaxed">
          Resume Analyzer is a modern AI-powered tool designed to help
          professionals and students craft the perfect resume.  
          Our mission is simple: make resumes smarter, cleaner, and more effective.
        </p>
      </div>

      {/* Vision & Mission Section */}
      <section className="max-w-5xl mt-20 grid sm:grid-cols-2 gap-12 text-center">
        <div className="p-8 rounded-2xl border border-black shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-base leading-relaxed">
            To empower individuals with AI-driven insights, ensuring that every
            resume stands out in a competitive job market.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-black shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-base leading-relaxed">
            To simplify resume building by combining advanced analysis with
            actionable recommendations, helping you secure opportunities faster.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mt-20 space-y-10">
        <h2 className="text-3xl font-bold text-center">What We Offer</h2>
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-xl border border-black">
            <h3 className="text-xl font-semibold mb-2">Smart Analysis</h3>
            <p className="text-sm">
              AI-powered resume scoring with detailed breakdowns.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-black">
            <h3 className="text-xl font-semibold mb-2">Actionable Feedback</h3>
            <p className="text-sm">
              Practical insights to instantly improve your resume.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-black">
            <h3 className="text-xl font-semibold mb-2">ATS-Friendly</h3>
            <p className="text-sm">
              Ensure your resume passes Applicant Tracking Systems with ease.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-sm text-black border-t border-black pt-6 text-center w-full">
        © {new Date().getFullYear()} Resume Analyzer. All rights reserved.
      </footer>
    </main>
  );
}
