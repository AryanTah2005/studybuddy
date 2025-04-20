"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Shadcn Table components
import { api } from "@/trpc/react";

interface CourseMaterial {
  file_name: string | null;
  file_url: string;
  file_size: number | null;
}

export default function CourseMaterialList({ courseId }: { courseId: string }) {
  const { data: courseMaterials, isLoading, isError } = api.files.getCourseFiles.useQuery({
    course_id: courseId,
  });

  if (isLoading) {
    return <p>Loading course materials...</p>;
  }

  if (isError) {
    return <p>Error loading course materials.</p>;
  }

  const dataToDisplay: CourseMaterial[] = Array.isArray(courseMaterials) ? courseMaterials : [];

  return (
    <div className="w-full">
      {dataToDisplay.length > 0
        ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataToDisplay.map((file) => (
                <TableRow key={file.file_url}>
                  {/* Using file_url as key might be safer if file_name isn't unique */}
                  <TableCell>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.file_name?.split("-_-name-_-")[1] || "Unknown File"}
                    </a>
                  </TableCell>
                  <TableCell>
                    {file.file_size ? `${file.file_size} bytes` : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
        : <p>No course materials available yet.</p>}
    </div>
  );
}
