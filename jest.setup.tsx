import "@testing-library/jest-dom";

import React from "react";

process.env.NEXT_PUBLIC_API_ENV = "mock";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@supabase/auth-helpers-react", () => ({
  useSupabaseClient: jest.fn(),
  useUser: jest.fn(),
}));

jest.mock("react-markdown", () => (props) => {
  return <div>{props.children}</div>;
});

jest.mock("remark-gfm", () => () => {}); // eslint-disable-line @typescript-eslint/no-empty-function

Object.defineProperty(window.Element.prototype, "scrollIntoView", {
  writable: true,
  value: jest.fn(),
});
