import { render } from "@testing-library/react";
import React from "react";

import Main from "../pages/index";

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
  test("checks that main is rendered", () => {
    const { getByRole } = render(<Main />);
    const headerImage = getByRole("main");
    expect(headerImage).toBeInTheDocument();
  });
});
