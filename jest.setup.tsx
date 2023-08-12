// eslint-disable-next-line
import "@testing-library/jest-dom";

import React from "react";
import type * as ReactDom from "react-dom";

process.env.NEXT_PUBLIC_API_ENV = "mock"; // Set the test env var to use the mock API

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@supabase/auth-helpers-react", () => ({
  useSupabaseClient: jest.fn(),
  useUser: jest.fn(),
}));

// eslint-disable-next-line
jest.mock("react-markdown", () => (props: any) => {
  return <div>{props.children}</div>;
});

jest.mock("react-dom", () => ({
  ...jest.requireActual<typeof ReactDom>("react-dom"),
  preload: jest.fn(),
}));

jest.mock("remark-gfm", () => () => {}); // eslint-disable-line @typescript-eslint/no-empty-function

Object.defineProperty(window.Element.prototype, "scrollIntoView", {
  writable: true,
  value: jest.fn(),
});
