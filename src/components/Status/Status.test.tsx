import React from "react";

import { QueryStatus } from "../../hooks/useChat";
import { renderWithChatContext } from "../../utils";
import { Status } from "./Status";

describe("Loading component", () => {
  it("renders without crashing", () => {
    const { getByRole } = renderWithChatContext(<Status />);
    const loadingElement = getByRole("status");
    expect(loadingElement).toBeInTheDocument();
  });

  it("renders loading element and correct 'visually-hidden' text", () => {
    const { getByText, getByRole } = renderWithChatContext(<Status />);
    const loadingText = getByText("Loading...");
    const loadingElement = getByRole("status");
    expect(loadingText).toBeInTheDocument();
    expect(loadingElement).toBeInTheDocument();
  });

  it("does not render if QueryStatus is success or idle", () => {
    const { queryByRole } = renderWithChatContext(<Status />, {
      chatStatus: QueryStatus.Idle,
    });
    const loadingElement = queryByRole("status");
    expect(loadingElement).not.toBeInTheDocument();

    const { queryByRole: queryByRole2 } = renderWithChatContext(<Status />, {
      chatStatus: QueryStatus.Success,
    });
    const loadingElement2 = queryByRole2("status");
    expect(loadingElement2).not.toBeInTheDocument();
  });

  it("renders error message if QueryStatus is error", () => {
    const { getByText } = renderWithChatContext(<Status />, {
      chatStatus: QueryStatus.Error,
    });
    const errorMessage = getByText(
      "Sorry, an error occurred. Please try again!"
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
