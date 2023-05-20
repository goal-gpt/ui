import { QueryClient } from "@tanstack/react-query";
import React from "react";

import Main from "../pages/index";
import { renderWithClient } from "../src/utils";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/status",
      pathname: "/status",
      query: { category: "budgeting" },
      asPath: "",
      back: () => {
        return "/status";
      },
    };
  },
}));

describe("Main component", () => {
  it("checks that main is rendered", () => {
    const queryClient = new QueryClient();
    const { getByRole } = renderWithClient(queryClient, <Main />);
    const headerImage = getByRole("main");
    expect(headerImage).toBeInTheDocument();
  });
});
