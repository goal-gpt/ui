import { act, renderHook, waitFor } from "@testing-library/react";

import { FatalError, useChat } from "./useChat";

describe("useChat", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve("Test response"),
        headers: {
          get: () => "application/json",
        },
      })
    ) as jest.Mock;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with correct defaults", () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.state).toBe("idle");
    expect(result.current.currentChat).toBeNull();
    expect(result.current.chatHistory).toEqual([]);
  });

  it("send message", async () => {
    const message = "Test message";
    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.sendMessage(message);
    });
    expect(result.current.state).toBe("waiting");

    act(() => {
      waitFor(() => {
        expect(result.current.state).toBe("idle");
        expect(result.current.chatHistory).toEqual([
          { role: "user", content: message },
          { role: "assistant", content: "Test response" },
        ]);
      });
    });
  });

  it("handle error", async () => {
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
    const { result } = renderHook(() => useChat());
    await waitFor(() => {
      expect(result.current.sendMessage(message)).rejects.toThrow(FatalError);
    });
  });
});
