"use client";

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

// Generated components (keep these as they are based on your file router)
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// Enhanced Course Material Upload Component
export const CourseMaterialUploadButton = ({ courseId }: {
  courseId: string;
}) => {
  return (
    <UploadDropzone
      endpoint="studyMaterial"
      // Add Shadcn-like styling classes to the dropzone
      className="
        w-full border border-dashed border-gray-300 rounded-md
        hover:border-gray-400 transition-colors duration-200
        bg-muted/30 text-muted-foreground
        p-6 text-center cursor-pointer
        ut-label:text-sm ut-allowed-content:ut-text-slate-500
        ut-button:rounded-md ut-button:bg-foreground
      "
      // Apply styles directly to the container if needed, or rely on className
      // uploadthing-container: {} // Example
      // uploadthing-input: {} // Example
      // uploadthing-label: {} // Example
      // uploadthing-progress: {} // Example

      // Keep the file renaming logic
      onBeforeUploadBegin={(files) => {
        // You can optionally perform client-side validation here
        console.log("Preparing files for upload:", files);
        return files.map((f) => {
          // Rename the file to include the courseId
          const renamedFile = new File([f], `${courseId}-_-name-_-${f.name}`, { type: f.type });
          console.log("Renamed file:", renamedFile.name);
          return renamedFile;
        });
      }}
      // Add callbacks for user feedback (optional but good for UX)
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files uploaded successfully:", res);
        // You might want to refresh the CourseMaterialList here
        // To do this, you'd need to use a state management solution or
        // refetch the data in the parent component after upload completes.
        alert("Upload Completed!"); // Simple feedback
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        console.error("Upload failed:", error);
        alert(`Upload Failed: ${error.message}`); // Simple feedback
      }}
      // onUploadProgress={(progress) => {
      //   // You can show a progress bar
      //   console.log("Upload progress:", progress);
      // }}
    />
  );
};
