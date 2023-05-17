import { render, screen } from "@testing-library/react";
import React from "react";

import { ChatMessage, ChatMessage as ChatMessageProps } from "./ChatMessage";

describe("ChatMessage", () => {
  test("renders with correct role and content", () => {
    const mockMessage: ChatMessageProps = {
      role: "user",
      content: "Test message",
    };

    render(<ChatMessage message={mockMessage} />);

    // Check if correct role class is added
    const messageElement = screen.getByText("Test message").parentElement;
    expect(messageElement).toHaveClass("chatMessageUser");

    // Check if correct content is displayed
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  test("renders with assistant role correctly", () => {
    const mockMessage: ChatMessageProps = {
      role: "assistant",
      content: "Test assistant message",
    };

    render(<ChatMessage message={mockMessage} />);

    // Check if correct role class is added
    const messageElement = screen.getByText(
      "Test assistant message"
    ).parentElement;
    expect(messageElement).toHaveClass("chatMessageAssistant");

    // Check if correct content is displayed
    expect(screen.getByText("Test assistant message")).toBeInTheDocument();
  });
});
