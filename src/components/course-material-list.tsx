"use client";
import { api } from "@/trpc/react";

export default function CourseMaterialList({
  courseId,
}: {
  courseId: string;
}) {
  const { data: courseMaterials, isLoading } = api.files.getCourseFiles.useQuery({
    course_id: courseId,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  console.log(courseMaterials);

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      {courseMaterials?.map((file) => (
        <div
          key={file.file_name}
          className="flex items-center justify-between w-full max-w-md p-4 border border-gray-300 rounded-lg shadow-md mb-2"
        >
          <a
            href={file.file_url}
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {file.file_name?.split("-_-name-_-")[1]}
          </a>
          <span className="text-gray-500">{file.file_size} bytes</span>
        </div>
      ))}

      }
    </div>
  );
}
