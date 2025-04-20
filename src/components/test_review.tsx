import React from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const TestReview = () => {
  return (
    <div className="border p-4  rounded-lg shadow-md flex flex-row gap-4 items-center justify-center">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Course" />
        </SelectTrigger>
        <SelectContent>
          {["CS50", "CS50W", "CS50AI"].map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
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
