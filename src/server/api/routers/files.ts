import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { courses, files } from "@/server/db/schema";
import { sql } from "drizzle-orm";

export const fileRouter = createTRPCRouter({
  getCourseFiles: publicProcedure
    .input(z.object({ course_id: z.string() }))
    .query(async ({ ctx, input }) => {
      let courseFiles = await ctx.db
        .select({
          file_name: files.file_name,
          file_size: files.file_size,
          file_url: files.file_url,
        })
        .from(files)
        .where(sql`${files.course_id} = ${input.course_id}`);
      return courseFiles;
    }),
  dropFile: publicProcedure
    .input(z.object({ course_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const courseFiles = await ctx.db
        .delete(files)
        .where(sql`${files.course_id} = ${input.course_id} AND ${files.user_id} = ${ctx.auth.userId}`);

      return courseFiles;
    }),
});
