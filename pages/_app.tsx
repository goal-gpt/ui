import "./index.scss";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

import { Cookie } from "../src/components/Cookie";
import { Database } from "../src/types/database";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );

  const queryClient = new QueryClient();

  return (
    <>
      <Cookie />
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <main className={poppins.className}>
            <Component {...pageProps} />
            <ToastContainer />
          </main>
        </SessionContextProvider>
      </QueryClientProvider>
    </>
  );
}
