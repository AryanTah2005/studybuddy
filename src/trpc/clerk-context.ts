import { createTRPCContext } from "@/server/api/trpc";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export const createContext = async (req: NextRequest) => {
  return await createTRPCContext({
    headers: req.headers,
  });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
