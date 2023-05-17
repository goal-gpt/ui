import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { useChat } from "../../hooks/useChat";
import ChatBox from "./ChatBox";

jest.mock("../../hooks/useChat");

describe("ChatBox", () => {
  beforeEach(() => {
    (useChat as jest.Mock).mockReturnValue({
      chatHistory: [],
      sendMessage: jest.fn(),
      state: "idle",
    });
  });

  it("renders without crashing", () => {
    render(<ChatBox />);
    expect(screen.getByPlaceholderText("Send a message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
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
    const mockSendMessage = jest.fn();
    (useChat as jest.Mock).mockReturnValue({
      chatHistory: [],
      sendMessage: mockSendMessage,
      state: "idle",
    });
    render(<ChatBox />);
    const input = screen.getByPlaceholderText("Send a message");
    const form = screen.getByRole("form");
    await act(async () => {
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.submit(form);
    });
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
  });
});
