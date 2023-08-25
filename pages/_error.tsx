import type { NextPageContext } from "next";
import React from "react";

import { Layout } from "@/components/Layout/Layout";

interface ErrorProps {
  statusCode?: number;
  message?: string;
}

function Error({ statusCode, message }: ErrorProps) {
  return (
    <Layout>
      <div id="error-page" className="dark:bg-slate-900">
        <div className="mx-auto flex h-screen max-w-screen-lg flex-col p-4">
          <h1 className="dark:text-slate-200">Oops!</h1>
          <p className="dark:text-slate-300">
            {message || "Sorry, an unexpected error has occurred."}{" "}
            {statusCode && `Error code: ${statusCode}`}
          </p>
        </div>
      </div>
    </Layout>
  );
}

Error.defaultProps = {
  statusCode: undefined,
  message: undefined,
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  let code: number;
  if (res) {
    code = res.statusCode;
  } else if (err) {
    code = err.statusCode || 404;
  } else {
    code = 404;
  }

  const message = err ? err.message : undefined;
  return { statusCode: code, message };
};

export default Error;
