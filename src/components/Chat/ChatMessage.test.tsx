import { render, screen } from "@testing-library/react";
import React from "react";

import type { IChatMessage as ChatMessageProps } from "./ChatMessage";
import { ChatMessage, ChatRole } from "./ChatMessage";

describe("ChatMessage", () => {
  it("renders with correct role and content", () => {
    const mockMessage: ChatMessageProps = {
      role: ChatRole.Human,
      content: "Test message",
    };

    render(<ChatMessage message={mockMessage} />);

    // Check if correct role class is added
    const messageElement = screen.getByText("Test message").parentElement;
    expect(messageElement).toHaveClass("items-end");
    expect(messageElement).not.toHaveClass("items-start");

    // Check if correct content is displayed
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("renders with assistant role correctly", () => {
    const mockMessage: ChatMessageProps = {
      role: ChatRole.AI,
      content: "Test assistant message",
    };

    render(<ChatMessage message={mockMessage} />);

    // Check if correct role class is added
    const messageElement = screen.getByText(
      "Test assistant message",
    ).parentElement;
    expect(messageElement).toHaveClass("items-start");
    expect(messageElement).not.toHaveClass("items-end");

    // Check if correct content is displayed
    expect(screen.getByText("Test assistant message")).toBeInTheDocument();
  });
});
