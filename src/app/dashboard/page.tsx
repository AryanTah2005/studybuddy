"use client";

import { ChatBot } from "@/components/ChatBot";
import { CourseList } from "@/components/CourseList";
import TestReview from "@/components/test_review";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInButton, UserButton, UserProfile } from "@clerk/nextjs";
import { MessageCircle, Settings, X } from "lucide-react";
import { useEffect } from "react"; // Top of your file
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
  source?: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
}

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [newTodo, setNewTodo] = useState("");

  const [googleLink, setGoogleLink] = useState("");
  const [canvasLink, setCanvasLink] = useState("");

  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Review calculus notes", completed: false },
    { id: "2", text: "Complete physics homework", completed: false },
  ]);
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  useEffect(() => {
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
          const iso = event.time;
          const dateKey = iso.split("T")[0];
          const timeObj = new Date(iso);
          const timePart = timeObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }); // "hh:mm AM/PM"
          if (!byDate[dateKey]) byDate[dateKey] = [];
          byDate[dateKey].push({
            id: event.id,
            title: event.title,
            time: timePart, // formatted "hh:mm AM/PM"
            source: event.source, // keep source info!
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

  const saveSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <span className="flex items-end gap-2">
            <h1 className="text-4xl font-bold text-primary">StudyBuddy</h1>
            <p className="text-gray-500">Your personal study assistant</p>
          </span>
          <UserButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 min-w-0">
            <Tabs defaultValue="course-list" className="w-full">
              <TabsList className=" w-full grid grid-cols-2 mb-12">
                <TabsTrigger value="course-list" className="w-full text-center">
                  Course List
                </TabsTrigger>
                <TabsTrigger value="test-review" className="w-full text-center">
                  Test Review
                </TabsTrigger>
              </TabsList>
              <TabsContent value="test-review">
                <div className="flex flex-col gap-6">
                  <TestReview />
                </div>
              </TabsContent>
              <TabsContent value="course-list">
                <div className="flex flex-col gap-6">
                  <h2 className="mb-6 text-2xl font-bold text-left text-gray-800 mt-12">Your Courses</h2>
                  <CourseList />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6 min-w-0">
            <Card className="w-full min-w-0 relative shadow-none">
              <CardHeader>
                <div className="flex justify-between items-center w-full">
                  <CardTitle className="text-2xl">Calendar</CardTitle>
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
                    {selectedDateEvents.length === 0
                      ? (
                        <div className="bg-gray-100 text-gray-500 py-2 px-4 rounded text-center font-bold">
                          Your schedule’s taking the day off 💤
                        </div>
                      )
                      : (
                        selectedDateEvents.map(event => (
                          <div
                            key={event.id}
                            className={`
          flex items-center justify-between p-2 rounded
          ${
                              event.source === "canvas"
                                ? "bg-red-100 text-red-700"
                                : event.source === "google"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-muted"
                            }
        `}
                          >
                            <span>
                              <span className="font-bold">{event.time}</span> - {event.title}
                              {event.source === "canvas" && <span className="ml-2 text-xs text-red-500">(Canvas)</span>}
                              {event.source === "google" && (
                                <span className="ml-2 text-xs text-blue-500">
                                  (Google)
                                </span>
                              )}
                            </span>
                          </div>
                        ))
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="min-w-0">
              <CardHeader>
                <CardTitle className="text-2xl">To-Do List</CardTitle>
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
              <Input
                id="google-link"
                value={googleLink}
                onChange={e => setGoogleLink(e.target.value)}
                placeholder="https://calendar.google.com/calendar/ical/..."
              />
            </div>
            <div>
              <label htmlFor="canvas-link" className="block text-sm font-medium text-gray-700 mb-2">Canvas Link</label>
              <Input
                id="canvas-link"
                value={canvasLink}
                onChange={e => setCanvasLink(e.target.value)}
                placeholder="https://elearn.ucr.edu/feeds/calendars/..."
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
