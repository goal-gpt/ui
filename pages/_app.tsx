import "./index.scss";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { DefaultSeo } from "next-seo";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import { Cookie } from "../src/components/Cookie";
import { Database } from "../src/types/database";

const poppins = Poppins({
  style: ["normal", "italic"],
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

  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkUser = supabaseClient.auth.onAuthStateChange(() => {
      setIsAuthChecking(false);
    });

    return () => {
      checkUser.data?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <main className={poppins.className}>
            <DefaultSeo
              defaultTitle="eras"
              titleTemplate="eras | %s"
              description="eras is your personal finance companion."
              canonical="https://app.eras.fyi"
              openGraph={{
                title: "eras | your personal finance companion",
                type: "website",
                locale: "en_US",
                url: "https://app.eras.fyi",
                site_name: "eras",
                images: [
                  {
                    url: "https://app.eras.fyi/_ipx/w_640,q_75/%2Feras-logo.png?url=%2Feras-logo.png&w=640&q=75",
                    width: 200,
                    height: 140,
                    alt: "eras logo",
                  },
                ],
              }}
              twitter={{
                handle: "@erasfyi",
                site: "@erasfyi",
                cardType: "summary",
              }}
            />
            <Component {...pageProps} isAuthChecking={isAuthChecking} />
            <ToastContainer />
            <Cookie />
          </main>
        </SessionContextProvider>
      </QueryClientProvider>
    </>
  );
}
