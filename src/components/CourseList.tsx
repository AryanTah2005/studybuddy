"use client";

interface Course {
  id: string;
  name: string;
  description: string;
}

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  return (
    <div className="grid gap-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="p-4 bg-card rounded-lg border hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold">{course.name}</h3>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      ))}
    </div>
  );
}