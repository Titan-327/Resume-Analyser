"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { processResume } from "../actions/processResume";
import { fetchResumes } from "../actions/fetchResumes";

// ✅ Custom tick component (only date on X-axis)
const CustomTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#374151"
        fontSize={12}
      >
        {payload.value}
      </text>
    </g>
  );
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [resumes, setResumes] = useState<any[]>([]);

  // ✅ Popup state
  const [popup, setPopup] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  useEffect(() => {
    async function loadResumes() {
      try {
        if (session?.user) {
          const data = await fetchResumes();
          setResumes(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching resumes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResumes();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-black font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="p-8 text-center shadow-md">
          <CardTitle className="text-2xl mb-4">Access Denied</CardTitle>
          <p className="text-gray-600 mb-4">
            Please sign in to view your dashboard.
          </p>
          <Link href={`/signin`}>
            <Button>Sign in</Button>
          </Link>
        </Card>
      </div>
    );
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const result = await processResume(file);

      if (!result.success && result.notResume) {
        setPopup({ open: true, message: "Please upload a resume." });
      } else if (result.success) {
        setPopup({
          open: true,
          message: "Resume uploaded & processed successfully!",
        });

        const updated = await fetchResumes();
        setResumes(Array.isArray(updated) ? updated : []);
      } else {
        setPopup({ open: true, message: "Failed to process PDF." });
      }

      setOpen(false);
    } catch (err) {
      console.error("Error processing resume:", err);
      setPopup({ open: true, message: "Failed to process PDF." });
    } finally {
      setUploading(false);
    }
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return "Unknown Date";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "Unknown Date"
      : d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  }

  function formatScore(score: any) {
    if (!score) return "—";
    const num = parseInt(score, 10);
    return isNaN(num) ? score : `${num}/100`;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1 p-8">
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {session?.user?.name}
            </h1>
            <p className="text-gray-600">Track and improve your resumes</p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => setOpen(true)}
          >
            <UploadCloud className="h-4 w-4" />
            Upload Resume
          </Button>
        </div>

        {/* ===== Upload Dialog ===== */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Your Resume</DialogTitle>
            </DialogHeader>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="mt-4"
            />
            {uploading && (
              <p className="text-sm text-gray-500 mt-2">Processing PDF...</p>
            )}
          </DialogContent>
        </Dialog>

        {/* ===== Popup Dialog ===== */}
        <Dialog
          open={popup.open}
          onOpenChange={(val) => setPopup({ ...popup, open: val })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notification</DialogTitle>
            </DialogHeader>
            <p>{popup.message}</p>
            <Button
              onClick={() => setPopup({ ...popup, open: false })}
              className="mt-4"
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>

        {/* ===== Dashboard Cards (only 2 now) ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-lg">Latest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-black">
                {formatScore(resumes[0]?.score)}
              </p>
              <p className="text-gray-500 text-sm">
                {resumes[0]?.name
                  ? `For ${resumes[0].name}`
                  : "Your most recent analysis"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-lg">Resumes Uploaded</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-black">{resumes.length}</p>
              <p className="text-gray-500 text-sm">Across all sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* ===== Resume History Section ===== */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Recent Resumes</h2>
          <div className="space-y-4">
            {resumes.length === 0 ? (
              <p className="text-gray-500">No resumes uploaded yet.</p>
            ) : (
              resumes.map((resume, idx) => (
                <Card
                  key={idx}
                  className="p-4 flex items-center justify-between shadow-sm"
                >
                  <div className="max-w-[70%]">
                    <h3 className="font-medium truncate">
                      {resume.filename || resume.name || "Unnamed Resume"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Scored {formatScore(resume.score)} · Uploaded{" "}
                      {formatDate(resume.uploadedAt || resume.createdAt)}
                    </p>
                  </div>
                  <Link href={`/resumes/${resume.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* ===== Resume Scores Graph ===== */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Resume Score Trends</h2>
          <Card className="p-6 shadow-md bg-white">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={resumes
                  .slice()
                  .reverse()
                  .map((r) => ({
                    date: formatDate(r.uploadedAt || r.createdAt),
                    score: parseInt(r.score, 10) || 0,
                  }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#374151"
                  tick={<CustomTick />}
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#374151"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    padding: "8px 12px",
                    fontSize: "14px",
                  }}
                  formatter={(value) => [`${value}/100`, "Score"]}
                  labelFormatter={(date) => `${date}`}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#2563eb", stroke: "white", strokeWidth: 2 }}
                  activeDot={{
                    r: 8,
                    fill: "#1e40af",
                    stroke: "white",
                    strokeWidth: 3,
                  }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>
    </div>
  );
}
