import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import { QueryStatus, useChat } from "../../hooks/useChat";
import ChatBox from "./ChatBox";
import { ChatContext } from "./ChatContext";
import { ChatRole } from "./ChatMessage";

let mockSendMessage: jest.Mock; // Initialised here to be used in useContext mock
let mockChatStatus: QueryStatus;

jest.mock("../../hooks/useChat");
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useContext: jest.fn().mockImplementation((context) => {
      if (context === ChatContext) {
        return {
          chatHistory: [],
          sendMessage: mockSendMessage,
          chatStatus: mockChatStatus,
          currentChat: null,
          currentPlan: { goal: "", steps: [] },
          chatID: null,
        };
      }
      return originalReact.useContext(context);
    }),
  };
});

describe("ChatBox", () => {
  let mockPush: jest.Mock;

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
    render(<ChatBox />);
    expect(screen.getByPlaceholderText("Send a message")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("inputs message correctly", async () => {
    render(<ChatBox />);
    const input = screen.getByPlaceholderText("Send a message");
    await act(async () => {
      fireEvent.change(input, { target: { value: "Test message" } });
    });
    expect(input).toHaveValue("Test message");
  });

  it("sends message on form submit", async () => {
    render(<ChatBox />);
    expect(mockSendMessage).toHaveBeenCalledTimes(1); // initial message on mount
    const input = screen.getByPlaceholderText("Send a message");
    const form = screen.getByRole("form");
    act(() => {
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.submit(form);
    });
    expect(mockSendMessage).toHaveBeenCalledTimes(2);
  });

  it("doesn't send message when chatStatus is loading", async () => {
    mockChatStatus = QueryStatus.Loading; // doesn't affect the initial message
    render(<ChatBox />);
    expect(mockSendMessage).toHaveBeenCalledTimes(1); // initial message on mount
    const input = screen.getByPlaceholderText("Send a message");
    const form = screen.getByRole("form");
    act(() => {
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.submit(form);
    });
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
  });

  it("clears the input after submitting a message", async () => {
    render(<ChatBox />);
    const input = screen.getByPlaceholderText("Send a message");
    const form = screen.getByRole("form");
    act(() => {
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.submit(form);
    });
    expect(input).toHaveValue("");
  });

  it("shows spinner when the last message is from a human and chatStatus is loading", async () => {
    (useChat as jest.Mock).mockReturnValue({
      chatHistory: [{ role: ChatRole.Human, message: "Test" }],
      sendMessage: jest.fn(),
      chatStatus: QueryStatus.Loading,
    });
    render(<ChatBox />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays error message when error is true", () => {
    mockChatStatus = QueryStatus.Error;
    render(<ChatBox />);

    const errorMsg = screen.getByText(
      /Sorry, an error occurred. Please try again!/i
    );
    expect(errorMsg).toBeInTheDocument();
  });

  it("does not display error message when error is false", () => {
    render(<ChatBox />);

    const errorMsg = screen.queryByText(
      /Sorry, an error occurred. Please try again!/i
    );
    expect(errorMsg).not.toBeInTheDocument();
  });

  it("sets the message from the query prop", () => {
    render(<ChatBox query="Test message from query" />);
    expect(screen.getByPlaceholderText("Send a message")).toHaveValue(
      "Test message from query"
    );
  });

  it("updates the URL after the component renders", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    act(() => {
      render(<ChatBox query="Test message from query" />);
    });
    waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/", undefined, {
        shallow: true,
      });
    });
  });
});
