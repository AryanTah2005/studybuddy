"use client";
import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const CourseMaterialUploadButton = ({ courseId }: {
  courseId: string;
}) => (
  <UploadDropzone
    endpoint="studyMaterial"
    onBeforeUploadBegin={(file) => {
      return file.map((f) => {
        return new File([f], courseId + "-_-name-_-" + f.name, { type: f.type });
      });
    }}
  />
);
