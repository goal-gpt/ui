import React from "react";

import Main from "../pages/index";
import { renderWithClient } from "../src/utils";

describe("Main component", () => {
  it("checks that main is rendered", () => {
    const { getByRole } = renderWithClient(<Main />);

    const chatElement = getByRole("log");
    expect(chatElement).toBeInTheDocument();
  });
});
