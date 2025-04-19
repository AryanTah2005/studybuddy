
import { createTRPCContext } from "@/server/api/trpc";
import { NextRequest } from 'next/server';
import { auth } from "@clerk/nextjs/server";

export const createContext = async (req: NextRequest) => {
  return await createTRPCContext({
    headers: req.headers,
  });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
