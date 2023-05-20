import { render, screen } from "@testing-library/react";
import React from "react";

import { ChatMessage, ChatMessage as ChatMessageProps } from "./ChatMessage";

describe("ChatMessage", () => {
  it("renders with correct role and content", () => {
    const mockMessage: ChatMessageProps = {
      role: "human",
      content: "Test message",
    };

    render(<ChatMessage message={mockMessage} />);

    // Check if correct role class is added
    const messageElement = screen.getByText("Test message").parentElement;
    expect(messageElement).toHaveClass("chatMessageHuman");

    // Check if correct content is displayed
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("renders with assistant role correctly", () => {
    const mockMessage: ChatMessageProps = {
      role: "ai",
      content: "Test assistant message",
    };

    render(<ChatMessage message={mockMessage} />);

    // Check if correct role class is added
    const messageElement = screen.getByText(
      "Test assistant message"
    ).parentElement;
    expect(messageElement).toHaveClass("chatMessageAI");

    // Check if correct content is displayed
    expect(screen.getByText("Test assistant message")).toBeInTheDocument();
  });
});
