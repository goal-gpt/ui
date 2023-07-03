import { act, cleanup, renderHook, waitFor } from "@testing-library/react";

import { ChatRole } from "../components/Chat";
import { createWrapper } from "../utils";
import { useChat } from "./useChat";

const originalFetch = global.fetch;

describe("useChat", () => {
  const testResponse = "Test response";

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ chat: 42, text: testResponse }),
        headers: {
          get: () => "application/json",
        },
      })
    ) as jest.Mock;
  });

  afterAll(() => {
    cleanup();
    jest.restoreAllMocks();
    global.fetch = originalFetch;
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
        { role: ChatRole.AI, content: testResponse },
      ]);
    });
  });

  it("handles errors", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        headers: {
          get: () => "application/json",
        },
      })
    ) as jest.Mock;
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
