import { db } from "@/server/db";
import { files } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  studyMaterial: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    text: {
      maxFileSize: "64KB",
      maxFileCount: 1,
    },
  })
    .middleware(async (req) => {
      console.log("Middleware triggered");
      const user = await auth();

      if (!user) throw new UploadThingError("Unauthorized");
      console.log("User ID:", user.userId);

      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const course_id = file.name.split("-_-")[0];
      if (!course_id) {
        throw new UploadThingError("Invalid file name");
      }

      console.log("File uploaded:", course_id);

      await db.insert(files).values({
        user_id: metadata.userId,
        course_id,
        file_name: file.name,
        file_size: file.size,
        file_url: file.ufsUrl,
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
