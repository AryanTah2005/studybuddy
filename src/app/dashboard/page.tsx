"use client";

import { useEffect } from "react"; // Top of your file
import { ChatBot } from "@/components/ChatBot";
import { CourseList } from "@/components/CourseList";
import TestReview from "@/components/test_review";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import { MessageCircle, Settings, X } from "lucide-react";
import { useState } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface Event {
  id: string;
  title: string;
  time: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
}

export default function Dashboard() {

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newTodo, setNewTodo] = useState("");

  const [googleLink, setGoogleLink] = useState("");
  const [canvasLink, setCanvasLink] = useState("");

  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Mathematics", description: "Advanced Calculus and Linear Algebra" },
    { id: "2", name: "Physics", description: "Quantum Mechanics Fundamentals" },
  ]);
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Review calculus notes", completed: false },
    { id: "2", text: "Complete physics homework", completed: false },
  ]);
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const handleAddCourse = () => {
    if (!newCourseName.trim() || !newCourseDescription.trim()) return;
    const newCourse = { id: Math.random().toString(), name: newCourseName, description: newCourseDescription };
    setCourses(prev => [...prev, newCourse]);
    setIsNewCourseOpen(false);
    setNewCourseName("");
    setNewCourseDescription("");
  };
  useEffect(() => {
	// Only fire if at least one link is set
	if ((!googleLink || googleLink.trim() === "") && (!canvasLink || canvasLink.trim() === "")) {
	  return;
	}
  
	const fetchEvents = async () => {
	  try {
		const res = await fetch("/api/fetchIcs", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ google: googleLink, canvas: canvasLink }),
		});
		if (!res.ok) {
		  const text = await res.text();
		  throw new Error("Server error: " + text);
		}
		// After fetching:
const data = await res.json();

// Build event date mapping like: { "2024-06-12": [event, ...], ... }
const byDate: Record<string, Event[]> = {};
for (const event of data.events) {
  // Use the ICS event's time to extract just the date
  const iso = event.time; // "2024-06-12T14:00:00Z"
  const dateKey = iso.split("T")[0]; // "2024-06-12"
  const timePart = iso.split("T")[1]?.slice(0,5) ?? ""; // "14:00" (first 5 chars of time)
  if (!byDate[dateKey]) byDate[dateKey] = [];
  byDate[dateKey].push({
    id: event.id,
    title: event.title,
    time: timePart, // Store just the "HH:MM"
  });
}
setEvents(byDate);
	  } catch (error) {
		console.error("Failed to fetch/parsing events:", error);
	  }
	};
  
	fetchEvents();
  }, [googleLink, canvasLink]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos(prev => [...prev, { id: Math.random().toString(), text: newTodo, completed: false }]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const removeTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const selectedDateStr = date?.toISOString().split("T")[0];
  const selectedDateEvents = selectedDateStr ? events[selectedDateStr] || [] : [];
  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
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
    onSuccess: async (opts) => {
      await utils.course.getCourses.invalidate();
    },
  });

  const saveSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Study Planner</h1>
          <Button onClick={() => setIsNewCourseOpen(true)}>Add New Course</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 min-w-0">
            <CourseList courses={courses} />
            <TestReview />
          </div>

          <div className="space-y-6 min-w-0">
            <Card className="w-full min-w-0 relative">
              <CardHeader>
                <div className="flex justify-between items-center w-full">
                  <CardTitle>Calendar</CardTitle>
                  <Button variant="ghost" onClick={() => setIsSettingsOpen(true)}>
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="overflow-auto">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full rounded-md border [&_table]:w-full [&_table]:table-fixed [&_th]:w-[14.2857%] [&_td]:w-[14.2857%] [&_th]:py-2 [&_th]:text-center [&_td]:p-2 [&_td]:text-center"
                />

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Events for {date?.toLocaleDateString()}</h3>
                  </div>
                  <div className="space-y-2">
				  {selectedDateEvents.map(event => (
  <div key={event.id}>
    <span>{event.time} - {event.title}</span>
  </div>
))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="min-w-0">
              <CardHeader>
                <CardTitle>To-Do List</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                  <Input placeholder="Add new task..." value={newTodo} onChange={e => setNewTodo(e.target.value)} />
                  <Button type="submit" size="sm">Add</Button>
                </form>

                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Pending Tasks</h4>
                  {pendingTodos.map(todo => (
                    <div key={todo.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
                        <span>{todo.text}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeTodo(todo.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {completedTodos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Completed Tasks</h4>
                    {completedTodos.map(todo => (
                      <div key={todo.id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
                          <span className="line-through text-muted-foreground">{todo.text}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeTodo(todo.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" onClick={() => setIsChatOpen(true)}>
        <MessageCircle className="h-6 w-6" />
      </Button>

      <ChatBot open={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Dialog for adding new courses */}
      <Dialog open={isNewCourseOpen} onOpenChange={setIsNewCourseOpen}>
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
              onClick={() => {
                handleAddCourse();
                addNewCourse.mutate({ course_name: newCourseName, course_desc: newCourseDescription });
              }}
            >
              Add Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calendar Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="google-link" className="block text-sm font-medium text-gray-700 mb-2">
                Google Calendar Link
              </label>
              <Input id="google-link" value={googleLink} onChange={e => setGoogleLink(e.target.value)} placeholder="" />
            </div>
            <div>
              <label htmlFor="canvas-link" className="block text-sm font-medium text-gray-700 mb-2">Canvas Link</label>
              <Input
                id="canvas-link"
                value={canvasLink}
                onChange={e => setCanvasLink(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveSettings}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
