"use client";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormMessage, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useAddNote } from "@/utils/queries";


export const AddNote = ({ refetch }: {
  refetch: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const addNote = useAddNote({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      refetch();
    }
  });

  const formSchema = z.object({
    notename: z.string().nonempty({
      message: "Note name is required",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notename: "",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addNote.mutate({ note_name: values.notename });
    console.log(values.notename);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogClose className="absolute top-2 right-2" />
      <DialogTrigger onClick={() => setIsOpen(true)}>
        <Card>
          <CardDescription className="w-full h-32 bg-gray-200 flex items-center justify-center">
            Add New
          </CardDescription>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
          <DialogDescription>
            Add a new note to your gallery
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="notename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Note Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Note</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
