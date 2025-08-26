"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SWRConfig } from "swr";
import { jsonFetcher } from "@/lib/fetcher";

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SWRConfig value={{ fetcher: jsonFetcher }}>
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}
