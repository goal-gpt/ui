// import { fetchEventSource } from "@microsoft/fetch-event-source";
import { act, renderHook } from "@testing-library/react";

import { useChat } from "./useChat";

jest.mock("@microsoft/fetch-event-source", () => ({
  fetchEventSource: jest.fn(),
}));

describe("useChat", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should initialize with correct defaults", () => {
    const { result } = renderHook(() => useChat());

    expect(result.current.currentChat).toBeNull();
    expect(result.current.chatHistory).toEqual([]);
    expect(result.current.state).toBe("idle");
  });

  it("should clear the chat history", () => {
    const { result } = renderHook(() => useChat());

    // Simulate sending a message
    act(() => {
      result.current.sendMessage("Hello", [{ role: "user", content: "Hi" }]);
    });

    // Simulate clearing the chat
    act(() => {
      result.current.clear();
    });

    expect(result.current.chatHistory).toEqual([]);
  });

  // TODO: finish this test for sendMessage
  // it("should send a message and update chat history", async () => {
  //   (fetchEventSource as jest.Mock).mockImplementation((url, options) => {
  //     options.onmessage({ event: "open" });
  //     options.onmessage({
  //       event: "delta",
  //       data: JSON.stringify({ role: "assistant", content: "Hello" }),
  //     });
  //     options.onmessage({ event: "done" });
  //     return { close: jest.fn() };
  //   });

  //   const { result } = renderHook(() => useChat());

  //   act(() => {
  //     result.current.sendMessage("Hello", []);
  //   });

  //   // Wait for the updates to propagate
  //   await waitFor(() => {
  //     expect(result.current.currentChat).toBe("Hello");
  //     expect(result.current.chatHistory).toEqual([
  //       { role: "user", content: "Hello" },
  //       { role: "assistant", content: "Hello" },
  //     ]);
  //     expect(result.current.state).toBe("idle");
  //   });
  // });
});
