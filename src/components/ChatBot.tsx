"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatBotProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  text: string;
  sender: "user" | "bot";
}

export function ChatBot({ open, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your study assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    // Add bot response (this would be replaced with actual AI integration)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm here to help! What would you like to know about your studies?",
          sender: "bot",
        },
      ]);
    }, 1000);
    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col p-0">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Study Assistant</h2>
          <p className="text-sm text-muted-foreground">
            Ask me anything about your studies!
          </p>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
