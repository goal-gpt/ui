import "./index.scss";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/auth-helpers-react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import PlausibleProvider from "next-plausible";
import { DefaultSeo } from "next-seo";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import { AppConfig } from "@/utils/AppConfig";

import { ChatProvider } from "../src/components/Chat";
import { Cookie } from "../src/components/Cookie";
import type { Database } from "../src/types/database";

const poppins = Poppins({
  preload: true,
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>(),
  );

  const queryClient = new QueryClient();
  const router = useRouter();

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
          <PlausibleProvider
            domain="eras.fyi"
            enabled
            trackOutboundLinks
            taggedEvents
          >
            <ChatProvider>
              <Head>
                <meta charSet="UTF-8" key="charset" />
                <meta
                  name="viewport"
                  content="width=device-width,initial-scale=1"
                  key="viewport"
                />
                <link
                  rel="apple-touch-icon"
                  href={`${router.basePath}/apple-touch-icon.png`}
                  key="apple"
                />
                <link
                  rel="icon"
                  type="image/png"
                  sizes="32x32"
                  href={`${router.basePath}/favicon-32x32.png`}
                  key="icon32"
                />
                <link
                  rel="icon"
                  type="image/png"
                  sizes="16x16"
                  href={`${router.basePath}/favicon-16x16.png`}
                  key="icon16"
                />
                <link
                  rel="icon"
                  href={`${router.basePath}/favicon.ico`}
                  key="favicon"
                />
              </Head>
              <DefaultSeo
                defaultTitle={AppConfig.title}
                titleTemplate={`${AppConfig.site_name} | %s`}
                description={AppConfig.description}
                canonical="https://app.eras.fyi"
                openGraph={{
                  title: "eras | personal finance guidance",
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
              <main className={`${poppins.variable} font-sans antialiased`}>
                <Component {...pageProps} isAuthChecking={isAuthChecking} />
                <ToastContainer />
                <Cookie />
              </main>
            </ChatProvider>
          </PlausibleProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </>
  );
}
