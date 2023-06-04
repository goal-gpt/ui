import { act, renderHook, waitFor } from "@testing-library/react";

import { ChatRole } from "../components/Chat";
import { createWrapper } from "../utils";
import { useChat } from "./useChat";

describe("useChat", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ chat: 42, text: "Test response" }),
        headers: {
          get: () => "application/json",
        },
      })
    ) as jest.Mock;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with correct defaults", async () => {
    const { result } = renderHook(() => useChat(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.chatStatus).toBe("idle");
      expect(result.current.currentChat).toBe("");
      expect(result.current.chatHistory).toEqual([]);
    });
  });

  it("can send messages", async () => {
    const message = "Test message";
    const { result } = renderHook(() => useChat(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.sendMessage(message);
    });
    expect(result.current.chatStatus).toBe("loading");

    await waitFor(() => {
      expect(result.current.chatStatus).toBe("success");
      expect(result.current.chatID).toBe(42);
      expect(result.current.chatHistory).toEqual([
        { role: ChatRole.Human, content: message },
        { role: ChatRole.AI, content: "Test response" },
      ]);
    });
  });

  it("handles errors", async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        headers: {
          get: () => "application/json",
        },
      })
    );
    const message = "Test message";
    const { result } = renderHook(() => useChat(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.sendMessage(message);
    });

    await waitFor(() => {
      expect(result.current.chatStatus).toBe("error");
      expect(result.current.chatHistory).toEqual([
        { role: ChatRole.Human, content: message },
      ]);
    });
  });
});
