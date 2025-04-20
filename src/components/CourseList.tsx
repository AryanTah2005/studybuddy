"use client"; 

import { useState } from "react";
import Link from "next/link";

interface Course {
  id: string;
  name: string;
  description: string;
  files: string[];
}

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleClose = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="gap-4 grid grid-cols-3 row-span-2">
      {courses.map((course) => (
        <div
          key={course.id}
          className="p-4 bg-card rounded-lg border hover:shadow-md transition-shadow"
          onClick={() => setSelectedCourse(course)}
        >
          <h3 className="text-lg font-semibold">{course.name}</h3>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      ))}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl mb-2">{selectedCourse.name}</h2>
            <p className="text-muted-foreground mb-4">
              {selectedCourse.description}
            </p>
            <div>
              {selectedCourse.files?.length ? (
                <ul className="text-2xl gap-2">
                  <div className="text-2xl">All Files</div>
                  {selectedCourse.files.map((file, index) => (
                    <li key={index}>
                      <Link href={file}
                        target = "blank"
                      />
                      {file}</li>
                  ))}
                </ul>
              ) : (
                <ul>No Files Added</ul>
              )}
            </div>
            <button className="text-gray-600 px-2 rounded-lg bg-green-600 hover:text-black text-lg">
              Add File
            </button>
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
