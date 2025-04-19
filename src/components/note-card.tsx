import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardFooter, CardDescription, CardTitle } from "./ui/card";

export const NoteCard = <T extends {
  note_name: string | null;
  note_id: string | null;
} ,>({ onDelete, note } : {
  onDelete: () => void;
  note: T;
}) => {
  return (
    <Card className="p-4 relative shadow-none h-96 group/card">
      <Trash
        onClick={onDelete}
        className="absolute shadow-none right-4 opacity-0 group-hover/card:opacity-100 transition-all duration-10 hover:text-red-500 hover:bg-gray-100 p-1 rounded-md"
        size={30}
        />
      <CardFooter className="absolute bottom-4 w-full">
      <CardTitle>{note.note_name}</CardTitle>
      </CardFooter>
    </Card>
  );
}

