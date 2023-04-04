import { fireEvent } from "@testing-library/react";
import React from "react";

import { renderWithRouter } from "../../utils/testHelpers";
import Main from "./Main";

describe("Main component", () => {
  test("checks that main is rendered", () => {
    const { getByRole } = renderWithRouter(<Main />);
    const headerImage = getByRole("main");
    expect(headerImage).toBeInTheDocument();
  });

  it("renders the welcome message", () => {
    const { getByText } = renderWithRouter(<Main />);
    const welcomeMessage = getByText(
      "Improving your personal finance skills is a journey. We are glad to be on it with you!"
    );

    expect(welcomeMessage).toBeInTheDocument();
  });

  it("hides the welcome message when dismissed", () => {
    const { queryByText, getByLabelText } = renderWithRouter(<Main />);
    const closeButton = getByLabelText("close-welcome");

    fireEvent.click(closeButton);

    const welcomeMessage = queryByText(
      "Improving your personal finance skills is a journey. We are glad to be on it with you!"
    );

    expect(welcomeMessage).not.toBeInTheDocument();
  });
});
