import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { preference } from "@/server/db/schema";
import { sql } from "drizzle-orm";

export const preferenceRouter = createTRPCRouter({
  getPreference: publicProcedure
    .query(async ({ ctx }) => {
      const links = await ctx.db
        .select({
          gcal_link: preference.gcal_link,
          canvas_link: preference.canvas_link,
        })
        .from(preference)
        .where(sql`${preference.user_id} = ${ctx.auth.userId}`);

      return links[0];
    }),
  addPreference: publicProcedure
    .input(z.object({
      gcal_link: z.string().url().nullish(),
      canvas_link: z.string().url().nullish(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updateResult = await ctx.db
        .update(preference)
        .set({
          gcal_link: input.gcal_link,
          canvas_link: input.canvas_link,
        })
        .where(sql`${preference.user_id} = ${ctx.auth.userId}`);

      const rowsAffected = updateResult.count; // Adjust based on your Drizzle return type

      if (rowsAffected === 0) {
        await ctx.db
          .insert(preference)
          .values({
            user_id: ctx.auth.userId,
            gcal_link: input.gcal_link,
            canvas_link: input.canvas_link,
          });
      }

      return true;
    }),
});
