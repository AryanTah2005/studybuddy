import React from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { api } from "@/trpc/react"; // Import your tRPC API

const TestReview = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data: courses, isLoading } = api.course.getCourses.useQuery();
  return (
    <div className="border p-4  rounded-lg shadow-md flex flex-row gap-4 items-center justify-center">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Course" />
        </SelectTrigger>
        <SelectContent>
        {isLoading ? (
            <SelectItem disabled value="loading">
              Loading...
            </SelectItem>
          ) : courses && courses.length > 0 ? (
            courses.map((course) => (
              <SelectItem key={course.course_id} value={course.course_id || ""}>
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
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        <SelectContent>
          {["Study Guide", "Practice Test", "Slides"].map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button>
        Generate
      </Button>
    </div>
  );
};

export default TestReview;
