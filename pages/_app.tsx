import "./index.scss";

import type { AppProps } from "next/app";
import React from "react";

import { Cookie } from "../src/components/Cookie";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Cookie />
      <Component {...pageProps} />
    </>
  );
}
