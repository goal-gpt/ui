import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import React from "react";

import { ChatBox, ChatForm } from "../src/components/Chat";
import { FeedbackForm } from "../src/components/Feedback";
import { Logo } from "../src/components/Logo/Logo";
import { Plan } from "../src/components/Plan";
import { Status } from "../src/components/Status";

function Main() {
  const router = useRouter();
  const { q: queryParam } = router.query || { q: "" };
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam || "";

  return (
    <>
      <NextSeo title="your personal finance companion" />
      <div className="flex flex-col">
        <div className="mx-auto max-w-screen-lg">
          <Logo />
          <div className="grow-2">
            <ChatBox />
          </div>
          <div
            className="grow-1 my-1"
            style={{ overflowX: "hidden", overflowY: "auto" }}
          >
            <Plan />
            <Status />
          </div>
          <div className="d-flex flex-column">
            <ChatForm query={query} />
            <div className="align-self-center">
              <FeedbackForm />
            </div>
            <div className="align-self-center">
              <p className="small my-2 text-center">
                Disclaimer: responses provide information only and should not be
                taken as professional advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
