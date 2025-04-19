import { api } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server"

export default async function Page({ params }: {
  params: Promise<{ noteId: string }>
}) {

  const noteId = await params;
  if (!noteId) {
    return <div>Loading</div>;
  }
  const { data, isPending } = api.post.fetchFullNote.useMutation({
    noteId: noteId.noteId,
  });


  if (isPending) {
    return <div>Loading</div>;
  }


  return (
    <HydrateClient>
      <main>
        {data?.note_name}
      </main>
    </HydrateClient>
  );
}
