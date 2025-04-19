
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main>
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-center">My Modern Homepage</h1>
          <main className="flex flex-col items-center mt-10">
            <h2 className="text-xl font-semibold">Welcome to My Website</h2>
            <p className="mt-4 text-center text-gray-600">
              This is a simple homepage built with React and Tailwind CSS.
            </p>
          </main>
          <footer className="mt-10 p-4 text-center text-gray-500">
            &copy; 2023 My Modern Homepage
          </footer>
        </div>

      </main>


    </HydrateClient>
  );
}
