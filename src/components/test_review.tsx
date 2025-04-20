import React from "react";

const TestReview = () => {
  return (
    <div className="border p-4  rounded-lg shadow-md flex flex-row gap-4 items-center justify-center">
      <div className="border px-4 rounded-lg shadow-md">
        <select className="">
          <option value="" disabled selected>Courses</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>

      {/* Row 2 */}
      <div className="border px-4  rounded-lg shadow-md ">
        <select className="">
          <option value="" disabled selected>Course Files</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>

      {/* Row 3 */}
      <div className="border px-4  rounded-lg shadow-md">
        <select className="">
          <option value="" disabled selected>It matters</option>
          <option value="option1">Study Guide</option>
          <option value="option2">Slides</option>
          <option value="option3">Mock Test</option>
        </select>
      </div>

      <div className="">
        <button className="bg-green-600 text-white px-4 rounded hover:bg-blue-600">
          Generate
        </button>
      </div>
    </div>
  );
};

export default TestReview;
