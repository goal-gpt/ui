import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import React from "react";

import { Layout } from "@/components/Layout/Layout";

import { ChatBox, ChatForm } from "../src/components/Chat";
import { Plan } from "../src/components/Plan";
import { Status } from "../src/components/Status";

function Main() {
  const router = useRouter();
  const { q: queryParam } = router.query || { q: "" };
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam || "";

  return (
    <>
      <NextSeo title="personal guidance" />
      <Layout>
        <div className="dark:bg-slate-900">
          <div className="mx-auto flex h-screen max-w-screen-lg flex-col">
            <div className="mt-2 grow-0">
              <ChatBox />
            </div>
            <div
              className="my-2 grow"
              style={{ overflowX: "hidden", overflowY: "auto" }}
            >
              <Plan />
              <Status />
            </div>
            <div className="w-full">
              <ChatForm query={query} />
              <div className="align-self-center">
                <p className="my-2 px-2 text-center text-xs dark:text-slate-300">
                  Disclaimer: responses provide information only and should not
                  be taken as professional advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Main;
