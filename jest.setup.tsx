import "@testing-library/jest-dom";

// import { rest } from "msw";
// import { setupServer } from "msw/node";
import React from "react";

process.env.NEXT_PUBLIC_API_ENV = "mock"; // Set the test env var to use the mock API

// const server = setupServer(
//   // capture "GET /greeting" requests
//   rest.get("/greeting", (req, res, ctx) => {
//     // respond using a mocked JSON body
//     return res(ctx.json({ greeting: "hello there" }));
//   })
// );

// // establish API mocking before all tests
// beforeAll(() => server.listen());
// // reset any request handlers that are declared as a part of our tests
// // (i.e. for testing one-time error scenarios)
// afterEach(() => server.resetHandlers());
// // clean up once the tests are done
// afterAll(() => server.close());

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
