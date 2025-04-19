import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { posts, notes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),
  createNote: publicProcedure.input(z.object({
    note_name: z.string(),
  })).mutation(async ({ ctx, input }) => {

    if (!ctx.auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    await ctx.db.insert(notes).values({
      note_name: input.note_name,
      userId: ctx.auth.userId,
    });

    return {
      message: "Note created",
    };
  }),
  fetchNotes: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }
    const currentNotes = await ctx.db.select()
      .from(notes)
      .where(eq(notes.userId, ctx.auth.userId));

    console.log(currentNotes);

    return currentNotes;
  }),
  deleteNote: publicProcedure.input(z.object({
    noteId: z.string(),
  })).mutation(async ({ ctx, input }) => {
    try {
      await ctx.db.delete(notes).where(eq(notes.note_id, input.noteId));
      return {
        message: "Note deleted",
      };
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete note",
      });
    }
  }),
  fetchFullNote: publicProcedure.input(z.object({
    noteId: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const note = await ctx.db.query.notes.findFirst({
      where: eq(notes.note_id, input.noteId),
    });

    if (note?.userId !== ctx.auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    return note;
  }),
});
