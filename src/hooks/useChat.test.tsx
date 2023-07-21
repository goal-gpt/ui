import { act, cleanup, renderHook, waitFor } from "@testing-library/react";

import { ChatRole } from "../components/Chat";
import { getLocalStorage, setLocalStorage } from "../services/browserTools";
import { createWrapper } from "../utils";
import { PlanType, QueryStatus, useChat } from "./useChat";

jest.mock("../services/browserTools");

const originalFetch = global.fetch;

describe("useChat", () => {
  const testResponse = "Test response";

  beforeEach(() => {
    (getLocalStorage as jest.Mock).mockClear();
    (setLocalStorage as jest.Mock).mockClear();
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

  afterEach(() => {
    jest.resetAllMocks();
    global.fetch = originalFetch;
    cleanup();
  });

  it("should initialize with correct defaults", async () => {
    const { result } = renderHook(() => useChat(), {
      wrapper: createWrapper(),
    });
    expect(result.current.currentChat).toBe("");
    expect(result.current.chatHistory).toEqual([]);
    expect(result.current.chatID).toBe(null);
    expect(result.current.chatStatus).toBe(QueryStatus.Idle);
    expect(result.current.currentPlan).toEqual({
      goal: "",
      steps: [],
    });
  });

  it("loads initial responses from local storage", async () => {
    const storedPlan: PlanType = {
      goal: "Test Goal",
      steps: [],
    };

    (getLocalStorage as jest.Mock).mockImplementation(() =>
      JSON.stringify({
        chat: 1,
        text: "Hello, test!",
        plan: storedPlan,
        links: [],
      })
    );

    const { result } = renderHook(() => useChat(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.currentChat).toBe("");
      expect(result.current.chatHistory).toEqual([
        { role: ChatRole.AI, content: "Hello, test!" },
      ]);
      expect(result.current.chatID).toBe(1);
      expect(result.current.chatStatus).toBe(QueryStatus.Idle);
      expect(result.current.currentPlan).toEqual({ ...storedPlan, links: [] });
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

  it("sets new responses to local storage when response state is updated", async () => {
    const initialPlan: PlanType = {
      goal: "Test Goal",
      steps: [],
    };

    (getLocalStorage as jest.Mock).mockImplementation(() =>
      JSON.stringify({
        chat: 1,
        text: "Hello, test!",
        plan: initialPlan,
        links: [],
      })
    );

    const newPlan: PlanType = {
      goal: "Updated Test Goal",
      steps: [],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            chat: 2,
            text: "Hello again, test!",
            plan: newPlan,
            links: [],
          }),
        headers: {
          get: () => "application/json",
        },
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useChat(), {
      wrapper: createWrapper(),
    });
    // Wait for initial load from local storage
    await waitFor(() => {
      expect(result.current.chatStatus).toBe("idle");
      expect(result.current.chatHistory).toEqual([
        { role: ChatRole.AI, content: "Hello, test!" },
      ]);
      expect(result.current.chatID).toBe(1);
    });

    // Send message and wait for update
    act(() => {
      result.current.sendMessage("Test message");
    });

    await waitFor(() => {
      expect(setLocalStorage).toHaveBeenCalledWith(
        "chatResponse",
        JSON.stringify({
          chat: 2,
          text: "Hello again, test!",
          plan: newPlan,
          links: [],
        })
      );
      expect(result.current.chatStatus).toBe("success");
      expect(result.current.chatHistory).toEqual([
        { role: ChatRole.AI, content: "Hello, test!" },
        { role: ChatRole.Human, content: "Test message" },
        { role: ChatRole.AI, content: "Hello again, test!" },
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
