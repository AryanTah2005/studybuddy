import Link from "next/link";

export default function Page() {
  // basic home
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Welcome to the Study Tool</h1>
      <p className="mt-4 text-lg">Your personal study assistant</p>
      <Link href="/dashboard" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">
        Go to Courses
      </Link>
    </div>
  );
}
