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

  it("doesn't send message when state is loading", async () => {
    const mockSendMessage = jest.fn();
    (useChat as jest.Mock).mockReturnValue({
      chatHistory: [],
      sendMessage: mockSendMessage,
      state: "loading",
    });
    render(<ChatBox />);
    const input = screen.getByPlaceholderText("Send a message");
    const form = screen.getByRole("form");
    await act(async () => {
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.submit(form);
    });
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("clears the input after submitting a message", async () => {
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
    expect(input).toHaveValue("");
  });

  it("shows spinner when the last message is from a human and state is loading", async () => {
    (useChat as jest.Mock).mockReturnValue({
      chatHistory: [{ role: "human", message: "Test" }],
      sendMessage: jest.fn(),
      state: "loading",
    });
    render(<ChatBox />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays error message when error is true", () => {
    (useChat as jest.Mock).mockReturnValue({
      chatHistory: [{ role: "human", message: "Test" }],
      sendMessage: jest.fn(),
      state: "error",
    });
    render(<ChatBox />);

    const errorMsg = screen.getByText(
      /Sorry, an error occurred. Please try again!/i
    );
    expect(errorMsg).toBeInTheDocument();
  });

  it("does not display error message when error is false", () => {
    (useChat as jest.Mock).mockReturnValue({
      chatHistory: [{ role: "human", message: "Test" }],
      sendMessage: jest.fn(),
      state: "idle",
    });
    render(<ChatBox />);

    const errorMsg = screen.queryByText(
      /Sorry, an error occurred. Please try again!/i
    );
    expect(errorMsg).not.toBeInTheDocument();
  });
});
