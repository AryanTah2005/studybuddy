import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { todo } from "@/server/db/schema";
import { sql } from "drizzle-orm";

export const todoRouter = createTRPCRouter({
  addTodo: publicProcedure
    .input(z.object({
      title: z.string().nonempty(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(todo).values({
        title: input.title,
        user_id: ctx.auth.userId,
      });
    }),

  getTodos: publicProcedure.query(async ({ ctx }) => {
    const todosList = await ctx.db.select({
      title: todo.title,
      done: todo.done,
      id: todo.id,
    }).from(todo).where(sql`${todo.user_id} = ${ctx.auth.userId}`);

    return todosList;
  }),

  dropTodo: publicProcedure.input(z.object({
    id: z.number().positive(),
  })).mutation(async ({ ctx, input }) => {
    await ctx.db
      .delete(todo)
      .where(sql`${todo.user_id} = ${ctx.auth.userId} AND ${todo.id} = ${input.id}`);
  }),
});
