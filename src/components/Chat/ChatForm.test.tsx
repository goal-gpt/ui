import { act, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import { PlanType, QueryStatus } from "../../hooks/useChat";
import { renderWithChatContext } from "../../utils";
import ChatForm from "./ChatForm";

const formPlaceholderText = /What plan would you like to make\?/i;
describe("ChatForm", () => {
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
    const { getByPlaceholderText } = renderWithChatContext(<ChatForm />);

    expect(getByPlaceholderText(formPlaceholderText)).toBeInTheDocument();
  });

  it("sends the message from the query prop", () => {
    const testQuery = "Test message from query";
    const { getByPlaceholderText } = renderWithChatContext(
      <ChatForm query={testQuery} />,
      {
        sendMessage: mockSendMessage,
      }
    );
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith(testQuery);
    expect(getByPlaceholderText(formPlaceholderText)).toHaveValue("");
    expect(mockPush).toHaveBeenCalledWith("/", undefined, {
      shallow: true,
    });
  });

  it("sends message on form submit", async () => {
    const { getByPlaceholderText, getByRole } = renderWithChatContext(
      <ChatForm />,
      {
        chatHistory: [],
        sendMessage: mockSendMessage,
      }
    );
    expect(mockSendMessage).toHaveBeenCalledTimes(0);

    const input = getByPlaceholderText(formPlaceholderText);
    const form = getByRole("form");
    act(() => {
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.submit(form);
    });
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
  });

  it("doesn't send message when chatStatus is loading", async () => {
    mockChatStatus = QueryStatus.Loading; // doesn't affect the initial message
    const { getByPlaceholderText, getByRole } = renderWithChatContext(
      <ChatForm />,
      {
        chatHistory: [],
        sendMessage: mockSendMessage,
        chatStatus: mockChatStatus,
      }
    );
    expect(mockSendMessage).toHaveBeenCalledTimes(0); // initial message on mount
    const input = getByPlaceholderText(formPlaceholderText);
    const form = getByRole("form");
    act(() => {
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.submit(form);
    });
    expect(mockSendMessage).toHaveBeenCalledTimes(0);
  });

  it("clears the input and updates placeholder after submitting a message", async () => {
    const { getByPlaceholderText, getByRole } = renderWithChatContext(
      <ChatForm />,
      {
        currentPlan: { goal: "test goal" } as PlanType,
        sendMessage: mockSendMessage,
      }
    );
    const input = getByPlaceholderText("Refine your plan...");
    const form = getByRole("form");

    act(() => {
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.submit(form);
    });
    expect(input).toHaveValue("");
  });

  it("updates the URL after the component renders", async () => {
    const testQuery = "Test query";
    act(() => {
      renderWithChatContext(<ChatForm query={testQuery} />);
    });
    expect(mockPush).toHaveBeenCalledWith("/", undefined, {
      shallow: true,
    });
  });
});
