"use client";
import { useUser } from "@clerk/nextjs";
import { AddNote } from "@/components/AddNote";
import { NoteCard } from "@/components/note-card";
import { useDeleteNote, useNotes } from "@/utils/queries";
import Link from "next/link";


const Page = () => {
  const { user } = useUser();
  const { data, error, isLoading, refetch } = useNotes();
  const deleteQuery = useDeleteNote({
    onSuccess: () => {
      refetch();
    }
  });

  if (!user) {
    return <div>loading...</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleDelete = (note_id: string) => {
    deleteQuery.mutate({
      noteId: note_id
    });
  }

  return (
    <main className="max-w-[1080px] p-4 mx-auto">
      <h1 className="font-semibold text-4xl">Gallery</h1>
      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3">
        {data?.map((note, index) => (
          <Link
            key={index}
            href={`/editor/${note.note_id}`}
          >
            <NoteCard
              note={note}
              onDelete={() => handleDelete(note.note_id)}
            />
          </Link>
        ))}

        <AddNote refetch={refetch} />
      </div>
    </main>
  );
}

export default Page;
