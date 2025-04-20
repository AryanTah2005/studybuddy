import { api } from "@/trpc/react";
import { Archive, Trash } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface Course {
  course_id: string | null;
  course_name: string | null;
  course_desc: string | null;
}

interface CourseListProps {
  courses: Course[];
}

const CourseCard = ({ course }: { course: Course }) => {
  const utils = api.useUtils();
  const dropCourse = api.course.dropCourse.useMutation({
    onMutate: (course) => {
      utils.course.getCourses.cancel();

      const previousCourses = utils.course.getCourses.getData();

      if (previousCourses) {
        const updatedCourses = previousCourses.filter((c: Course) => c.course_id !== course.course_id);
        utils.course.getCourses.setData(undefined, updatedCourses);
      }

      return { previousCourses };
    },

    onSuccess: () => {
      utils.course.getCourses.invalidate();
    },
  });
  return (
    <Card className="w-full h-52 flex flex-col justify-between shadow-none group/card">
      <CardHeader className="flex items-end">
        <div className="flex gap-4">
          <Trash
            className=" h-5 w-5 text-gray-500 cursor-pointer group-hover/card:opacity-100 opacity-0 transition-all ease-in-out"
            onClick={() => {
              if (!course.course_id) return;
              dropCourse.mutate({ course_id: course.course_id });
            }}
          />
          <Archive
            className=" h-5 w-5 text-gray-500 cursor-pointer group-hover/card:opacity-100 opacity-0 transition-all ease-in-out"
            onClick={() => {
              if (!course.course_id) return;
              dropCourse.mutate({ course_id: course.course_id });
            }}
          />
        </div>
      </CardHeader>
      <CardFooter className="flex flex-col w-full items-start justify-end">
        <CardTitle className="text-2xl">{course.course_name}</CardTitle>
        <CardDescription className="w-full">
          <p className="line-clamp-2">
            {course.course_desc}
          </p>
        </CardDescription>
      </CardFooter>
    </Card>
  );
};
export function CourseList({ courses }: CourseListProps) {
  const { data: courseList, isLoading } = api.course.getCourses.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!courseList || courseList.length === 0) {
    return <div>No courses available</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {courseList.map((course) => <CourseCard key={course.course_id} course={course} />)}
    </div>
  );
}
