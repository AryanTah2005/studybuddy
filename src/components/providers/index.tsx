import {TRPCReactProvider} from '@/trpc/react';
import { ClerkProvider } from '@clerk/nextjs';

export const Providers= ({ children } : {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </ClerkProvider>
  );
}
