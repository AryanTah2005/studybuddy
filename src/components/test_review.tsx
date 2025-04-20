import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { api } from "@/trpc/react";

const MAX_PROGRESS = 90; // leave last 10% for final step

const TestReview = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedContentType, setSelectedContentType] = useState<string>("");
  const [showFiles, setShowFiles] = useState(false);
  const [selectedFileUrls, setSelectedFileUrls] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: courses, isLoading: loadingCourses } =
    api.course.getCourses.useQuery();
  const {
    data: courseFiles,
    isLoading: loadingFiles,
    refetch: fetchFiles,
  } = api.files.getCourseFiles.useQuery(
    { course_id: selectedCourse },
    { enabled: false }
  );

  const handleFileCheck = (fileUrl: string, checked: boolean) => {
    setSelectedFileUrls((prev) =>
      checked ? [...prev, fileUrl] : prev.filter((url) => url !== fileUrl)
    );
  };

  const resetProgress = () => setProgress(0);

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleDownloadFile = async () => {
    if (!selectedContentType || !selectedFileUrls.length) {
      alert("Select content type and at least one file.");
      return;
    }
    setIsGenerating(true);
    resetProgress();
    setShowSuccess(false);
    let runningProgress = 0;
    const progressStep = Math.floor(MAX_PROGRESS / (selectedFileUrls.length + 2)); // +2 for AI/PDF steps

    try {
      // STEP 1: Generate LaTeX (simulate progress by file count)
      setProgress(runningProgress += progressStep);

      const latexResponse = await fetch("/api/chat/generate_material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls: selectedFileUrls,
          course: selectedCourse,
          contentType: selectedContentType,
        }),
      });

      // For a more "progressive" effect, simulate progress per file
      for (let i = 0; i < selectedFileUrls.length; i++) {
        await sleep(350);
        setProgress(runningProgress += progressStep);
      }

      if (!latexResponse.ok) {
        const error = await latexResponse.json();
        throw new Error(error.error || "Failed to generate LaTeX");
      }
      const { latex } = await latexResponse.json();
      setProgress(runningProgress += progressStep); // For AI generation

      // STEP 2: Send LaTeX to PDF generator (simulate waiting)
      const pdfResponse = await fetch("/api/chat/latex-to-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex }),
      });
      await sleep(500);
      setProgress(runningProgress += progressStep); // For PDF build

      if (!pdfResponse.ok) {
        const error = await pdfResponse.json();
        throw new Error(error.error || "Failed to generate PDF");
      }
      const blob = await pdfResponse.blob();

      setProgress(100);

      // STEP 3 - Download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "study-material.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500); // Hide after 2.5s
    } catch (err: any) {
      alert(err?.message || "An error occurred.");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleShowFiles = async () => {
    if (!selectedCourse) {
      alert("Select a course first.");
      return;
    }
    setShowFiles(true);
    await fetchFiles();
  };

  return (
    <div className="w-full max-w-xl p-6 bg-white border rounded-lg shadow-md mx-auto relative">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Generate Study Material PDF</h2>
      {/* STEP 1: Select Course & Content Type */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Course
          </label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose course..." />
            </SelectTrigger>
            <SelectContent>
              {loadingCourses ? (
                <SelectItem disabled value="loading">
                  Loading Courses…
                </SelectItem>
              ) : courses && courses.length > 0 ? (
                courses.map((course) => (
                  <SelectItem
                    key={course.course_id}
                    value={course.course_id || ""}
                  >
                    {course.course_name || "Unnamed Course"}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="no-courses">
                  No courses available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content Type
          </label>
          <Select value={selectedContentType} onValueChange={setSelectedContentType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose type..." />
            </SelectTrigger>
            <SelectContent>
              {["Study Guide", "Practice Test", "Slides"].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleShowFiles}
        variant="secondary"
        className="w-full mb-6"
        disabled={!selectedCourse}
      >
        {loadingFiles ? "Loading files..." : "Show Files"}
      </Button>

      {/* STEP 2: Choose Files */}
      {showFiles && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Files ({selectedFileUrls.length} selected)
          </label>
          <div className="bg-gray-50 border rounded p-2 max-h-44 overflow-y-auto">
            {courseFiles && courseFiles.length > 0 ? (
              courseFiles.map((file) => (
                <label
                  key={file.file_url}
                  className="flex items-center gap-2 py-1 pl-1 cursor-pointer hover:bg-gray-100 rounded transition"
                >
                  <input
                    type="checkbox"
                    value={file.file_url}
                    checked={selectedFileUrls.includes(file.file_url)}
                    onChange={e =>
                      handleFileCheck(file.file_url, e.target.checked)
                    }
                  />
                  <span className="truncate">
                    {file.file_name?.split("-_-name-_-")[1]}
                  </span>
                  <span className="ml-auto text-xs text-gray-400 w-16 text-right">
                    {((file.file_size / 1024) | 0)} KB
                  </span>
                </label>
              ))
            ) : (
              <div className="text-sm text-gray-400 px-2 py-2">
                No files found for this course.
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Download Button and Progress */}
      <Button
        className="w-full mb-2"
        disabled={isGenerating || !selectedFileUrls.length}
        onClick={handleDownloadFile}
      >
        {isGenerating ? "Generating File..." : "Download File"}
      </Button>

      {isGenerating && (
        <div className="w-full mt-2">
          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="bg-blue-500 h-2 transition-all"
            ></div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-1">
  {progress < 100
    ? `Processing... (${progress}%)`
    : "Done! Downloading..."}
</div>
        </div>
      )}

      {/* Success popup/modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg px-8 py-6 flex flex-col items-center animate-fadeIn">
            <span
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-3"
            >
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <div className="font-semibold text-green-600 text-lg mb-1">Download complete!</div>
            <div className="text-gray-500 text-center max-w-xs">
              Your PDF file has been successfully generated and downloaded.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestReview;