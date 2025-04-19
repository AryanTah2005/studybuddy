"use client";
import { api } from "@/trpc/react";

export const useNotes = api.post.fetchNotes.useQuery;
export const useAddNote = api.post.createNote.useMutation;
export const useDeleteNote = api.post.deleteNote.useMutation;

