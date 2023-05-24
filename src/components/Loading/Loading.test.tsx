import { render } from "@testing-library/react";
import React from "react";

import { Loading } from "./Loading";

describe("Loading component", () => {
  it("renders without crashing", () => {
    const { getByRole } = render(<Loading />);
    const loadingElement = getByRole("status");
    expect(loadingElement).toBeInTheDocument();
  });

  it("has the correct 'visually-hidden' text", () => {
    const { getByText } = render(<Loading />);
    const loadingText = getByText("Loading...");
    expect(loadingText).toBeInTheDocument();
  });
});
