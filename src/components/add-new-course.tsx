"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

export const AddNewCourse = () => {
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useUtils();
  const addNewCourse = api.course.addCourse.useMutation({
    onMutate: (opts) => {
      utils.course.getCourses.cancel();
      const previousCourses = utils.course.getCourses.getData();

      if (previousCourses) {
        const newCourse = {
          course_id: opts.course_name,
          course_name: opts.course_name,
          course_desc: opts.course_desc,
        };
        utils.course.getCourses.setData(undefined, [...previousCourses, newCourse]);
      }
      return { previousCourses };
    },
    onSuccess: async () => {
      await utils.course.getCourses.invalidate();
    },
  });

  const handleSubmit = useCallback(() => {
    addNewCourse.mutate({ course_name: newCourseName, course_desc: newCourseDescription });
    setIsOpen(false);
    setNewCourseName("");
    setNewCourseDescription("");
  }, [newCourseName, newCourseDescription, addNewCourse]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="course-name" className="block text-sm font-medium text-gray-700">Course Name</label>
            <Input
              id="course-name"
              value={newCourseName}
              onChange={e => setNewCourseName(e.target.value)}
              placeholder="e.g. Calculus I"
            />
          </div>
          <div>
            <label htmlFor="course-desc" className="block text-sm font-medium text-gray-700">Description</label>
            <Input
              id="course-desc"
              value={newCourseDescription}
              onChange={e => setNewCourseDescription(e.target.value)}
              placeholder="Brief description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
          >
            Add Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
