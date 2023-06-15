import { act, fireEvent, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import { QueryStatus } from "../../hooks/useChat";
import { renderWithChatContext } from "../../utils";
import ChatBox from "./ChatBox";
import { ChatRole } from "./ChatMessage";

const formPlaceholderText = /Refine your plan.../i;

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
    expect(
      screen.getByPlaceholderText(formPlaceholderText)
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("inputs message correctly", async () => {
    renderWithChatContext(<ChatBox />);
    const input = screen.getByPlaceholderText(formPlaceholderText);
    await act(async () => {
      fireEvent.change(input, { target: { value: "Test message" } });
    });
    expect(input).toHaveValue("Test message");
  });

  it("sends message on form submit", async () => {
    renderWithChatContext(<ChatBox />, {
      chatHistory: [],
      sendMessage: mockSendMessage,
    });
    expect(mockSendMessage).toHaveBeenCalledTimes(1); // initial message on mount
    const input = screen.getByPlaceholderText(formPlaceholderText);
    const form = screen.getByRole("form");
    act(() => {
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.submit(form);
    });
    expect(mockSendMessage).toHaveBeenCalledTimes(2);
  });

  it("doesn't send message when chatStatus is loading", async () => {
    mockChatStatus = QueryStatus.Loading; // doesn't affect the initial message
    renderWithChatContext(<ChatBox />, {
      chatHistory: [],
      sendMessage: mockSendMessage,
      chatStatus: mockChatStatus,
    });
    expect(mockSendMessage).toHaveBeenCalledTimes(1); // initial message on mount
    const input = screen.getByPlaceholderText(formPlaceholderText);
    const form = screen.getByRole("form");
    act(() => {
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.submit(form);
    });
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
  });

  it("clears the input after submitting a message", async () => {
    renderWithChatContext(<ChatBox />);
    const input = screen.getByPlaceholderText(formPlaceholderText);
    const form = screen.getByRole("form");
    act(() => {
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.submit(form);
    });
    expect(input).toHaveValue("");
  });

  it("shows spinner when the last message is from a human and chatStatus is loading", async () => {
    renderWithChatContext(<ChatBox />, {
      chatHistory: [{ role: ChatRole.Human, content: "Test" }],
      sendMessage: mockSendMessage,
      chatStatus: QueryStatus.Loading,
    });
    expect(screen.getByRole("status")).toBeInTheDocument();
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
