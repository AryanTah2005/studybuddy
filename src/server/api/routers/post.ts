import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { courses } from "@/server/db/schema";
import { sql } from "drizzle-orm";

export const courseRouter = createTRPCRouter({
  addCourse: publicProcedure
    .input(z.object({
      course_name: z.string().nonempty(),
      course_desc: z.string().nonempty(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(courses).values({
        course_name: input.course_name,
        course_desc: input.course_desc,
        user_id: ctx.auth.userId,
      });
    }),

  getCourses: publicProcedure.query(async ({ ctx }) => {
    const coursesList = await ctx.db.select({
      course_name: courses.course_name,
      course_desc: courses.course_desc,
      course_id: courses.course_id,
    }).from(courses).where(sql`${courses.user_id} = ${ctx.auth.userId}`);

    return coursesList;
  }),
  dropCourse: publicProcedure.input(z.object({
    course_id: z.string().uuid(),
  })).mutation(async ({ ctx, input }) => {
    const course = await ctx.db.select({
      course_id: courses.course_id,
    })
      .from(courses)
      .where(sql`${courses.user_id} = ${ctx.auth.userId} AND ${courses.course_id} = ${input.course_id}`);

    await ctx.db.delete(courses).where(sql`${courses.course_id} = ${input.course_id}`);
  }),
});
