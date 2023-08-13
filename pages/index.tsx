import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import React from "react";

import { Layout } from "@/components/Layout/Layout";

import { ChatBox, ChatForm } from "../src/components/Chat";
import { FeedbackForm } from "../src/components/Feedback";
import { Plan } from "../src/components/Plan";
import { Status } from "../src/components/Status";

function Main() {
  const router = useRouter();
  const { q: queryParam } = router.query || { q: "" };
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam || "";

  return (
    <>
      <NextSeo title="your personal finance companion" />
      <Layout>
        <div className="flex flex-col dark:bg-slate-900">
          <div className="mx-auto max-w-screen-lg">
            <ChatBox />
            <div
              className="my-1 grow"
              style={{ overflowX: "hidden", overflowY: "auto" }}
            >
              <Plan />
              <Status />
            </div>
            <div className="flex flex-col">
              <ChatForm query={query} />
              <div className="align-self-center">
                <FeedbackForm />
              </div>
              <div className="align-self-center">
                <p className="small my-2 text-center dark:text-slate-300">
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
