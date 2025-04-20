import CourseMaterialList from "@/components/course-material-list";
import { CourseMaterialUploadButton, UploadButton, UploadDropzone } from "@/components/ut-components";

export default async function Page({ params }: {
  params: Promise<{
    courseId: string;
  }>;
}) {
  const { courseId } = await params;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Course Details</h1>
      <p className="mt-4 text-lg">Course ID: {courseId}</p>
      <CourseMaterialUploadButton courseId={courseId} />
      <CourseMaterialList courseId={courseId} />
    </div>
  );
}
