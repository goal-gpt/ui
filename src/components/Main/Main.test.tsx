import {
  // act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";

import Main from "./Main";

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
  test("checks that main is rendered", async () => {
    render(<Main />);
    const headerImage = await waitFor(() => screen.getByRole("main"));
    expect(headerImage).toBeInTheDocument();
  });

  it("renders the welcome message", () => {
    const { getByText } = render(<Main />);
    const welcomeMessage = getByText(
      "Improving your personal finance skills is a journey. We are glad to be on it with you!"
    );

    expect(welcomeMessage).toBeInTheDocument();
  });

  it("hides the welcome message when dismissed", () => {
    const { queryByText, getByLabelText } = render(<Main />);
    const closeButton = getByLabelText("close-welcome");

    fireEvent.click(closeButton);

    const welcomeMessage = queryByText(
      "Improving your personal finance skills is a journey. We are glad to be on it with you!"
    );

    expect(welcomeMessage).not.toBeInTheDocument();
  });
});
