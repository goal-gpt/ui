import { NextSeo } from "next-seo";

import { ChatForm } from "@/components/Chat";
import { Layout } from "@/components/Layout/Layout";

function Plan() {
  return (
    <>
      <NextSeo title="make a new plan" />
      <Layout>
        <div className="dark:bg-slate-900">
          <div className="mx-auto flex h-screen max-w-screen-lg flex-col">
            <div className="w-full self-end">
              <ChatForm />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Plan;
