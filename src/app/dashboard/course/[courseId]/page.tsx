import CourseMaterialList from "@/components/course-material-list";
import { CourseMaterialUploadButton } from "@/components/ut-components"; // Assuming UploadButton and UploadDropzone are not directly used here
import { api } from "@/trpc/server";

export default async function Page({ params }: {
  params: Promise<{
    courseId: string;
  }>;
}) {
  const { courseId } = await params;
  const course = await api.course.getCourseById({
    course_id: courseId,
  });

  // Handle case where course is not found
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold text-red-600">Course Not Found</h1>
        <p className="mt-2 text-gray-600">Could not find course with ID: {courseId}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Container with reduced max-width for better readability */}
      <div className="grid gap-6">
        {/* Simple grid for layout */}
        <div className="border-b pb-4">
          {/* Separator for the top section */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{course.course_name}</h1>
          {course.course_desc && ( // Only show description if it exists
            <p className="mt-2 text-lg text-gray-700">{course.course_desc}</p>
          )}
        </div>

        <div className="grid gap-4">
          {/* Gap between sections */}
          <CourseMaterialList courseId={courseId} />
        </div>

        <div className="flex justify-end mt-4">
          {/* Align upload button to the right */}
          <CourseMaterialUploadButton courseId={courseId} />
        </div>
      </div>
    </div>
  );
}
