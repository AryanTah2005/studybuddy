"use client";

import { ChatBot } from "@/components/ChatBot";
import { CourseList } from "@/components/CourseList";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageCircle, Plus, X } from "lucide-react";
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

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false);
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      name: "Mathematics",
      description: "Advanced Calculus and Linear Algebra",
    },
    {
      id: "2",
      name: "Physics",
      description: "Quantum Mechanics Fundamentals",
    },
  ]);
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Review calculus notes", completed: false },
    { id: "2", text: "Complete physics homework", completed: false },
  ]);
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const [newTodo, setNewTodo] = useState("");

  const handleAddCourse = () => {
    if (!newCourseName.trim() || !newCourseDescription.trim()) return;

    const newCourse = {
      id: Math.random().toString(),
      name: newCourseName,
      description: newCourseDescription,
    };

    setCourses(prev => [...prev, newCourse]);
    setIsNewCourseOpen(false);
    setNewCourseName("");
    setNewCourseDescription("");
  };

  const handleAddEvent = () => {
    if (!date || !newEventTitle || !newEventTime) return;

    const dateStr = date.toISOString().split("T")[0];
    const newEvent = {
      id: Math.random().toString(),
      title: newEventTitle,
      time: newEventTime,
    };

    setEvents(prev => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), newEvent],
    }));

    setNewEventTitle("");
    setNewEventTime("");
    setIsNewEventOpen(false);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setTodos(prev => [...prev, {
      id: Math.random().toString(),
      text: newTodo,
      completed: false,
    }]);
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

  // Separate completed and pending todos
  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Study Planner</h1>
          <Button onClick={() => setIsNewCourseOpen(true)}>Add New Course</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CourseList courses={courses} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Events for {date?.toLocaleDateString()}</h3>
                    <Button size="sm" onClick={() => setIsNewEventOpen(true)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {selectedDateEvents.map(event => (
                      <div key={event.id} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span>{event.time} - {event.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>To-Do List</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add new task..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                  />
                  <Button type="submit" size="sm">Add</Button>
                </form>

                {/* Pending Todos */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Pending Tasks</h4>
                  {pendingTodos.map(todo => (
                    <div key={todo.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                        />
                        <span>{todo.text}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTodo(todo.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Completed Todos */}
                {completedTodos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Completed Tasks</h4>
                    {completedTodos.map(todo => (
                      <div key={todo.id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                          />
                          <span className="line-through text-muted-foreground">{todo.text}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTodo(todo.id)}
                        >
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

      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsChatOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <ChatBot open={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <Dialog open={isNewCourseOpen} onOpenChange={setIsNewCourseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Course Name</label>
              <Input
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="Enter course name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={newCourseDescription}
                onChange={(e) => setNewCourseDescription(e.target.value)}
                placeholder="Enter course description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCourse}>Add Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Event Title</label>
              <Input
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
