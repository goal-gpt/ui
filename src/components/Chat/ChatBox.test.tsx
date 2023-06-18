import { screen } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import { QueryStatus } from "../../hooks/useChat";
import { renderWithChatContext } from "../../utils";
import ChatBox from "./ChatBox";

describe("ChatBox", () => {
  let mockPush: jest.Mock;
  let mockSendMessage: jest.Mock;
  let mockChatStatus: QueryStatus;

  beforeEach(() => {
    mockPush = jest.fn();
    mockSendMessage = jest.fn();
    mockChatStatus = QueryStatus.Idle;
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

  it("displays error message when error is true", () => {
    mockChatStatus = QueryStatus.Error;
    renderWithChatContext(<ChatBox />, {
      chatHistory: [],
      sendMessage: mockSendMessage,
      chatStatus: mockChatStatus,
    });

    const errorMsg = screen.getByText(
      /Sorry, an error occurred. Please try again!/i
    );
    expect(errorMsg).toBeInTheDocument();
  });

  it("does not display error message when error is false", () => {
    renderWithChatContext(<ChatBox />);

    const errorMsg = screen.queryByText(
      /Sorry, an error occurred. Please try again!/i
    );
    expect(errorMsg).not.toBeInTheDocument();
  });
});
