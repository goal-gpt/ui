import { screen } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import { renderWithChatContext } from "../../utils";
import ChatBox from "./ChatBox";

jest.mock("../../hooks/useChat");

describe("ChatBox", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderWithChatContext(<ChatBox />);
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  it("does not display error message when error is false", () => {
    renderWithChatContext(<ChatBox />);

    const errorMsg = screen.queryByText(
      /Sorry, an error occurred. Please try again!/i,
    );
    expect(errorMsg).not.toBeInTheDocument();
  });
});
