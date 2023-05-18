import { useMemo, useState } from "react";

import { ChatMessage } from "../components/Chat/ChatMessage";

const API_PATH =
  process.env.NODE_ENV === "development"
    ? "http://localhost:50321/functions/v1/sera"
    : process.env.NEXT_PUBLIC_SUPABASE_EDGE_FUNCTION_URL || "";

const BEARER_TOKEN = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// const EventStreamContentType = "text/event-stream";
const JsonContentType = "application/json";

export class FatalError extends Error {}
export class RetriableError extends Error {}

/**
 * A custom hook to handle the chat state and logic
 */
export function useChat() {
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<"idle" | "waiting" | "loading">("idle");

  // Lets us cancel the stream
  const abortController = useMemo(() => new AbortController(), []);

  // NOTE: this is not used yet
  function cancel() {
    setState("idle");
    abortController.abort();
    if (currentChat) {
      const newHistory = [
        ...chatHistory,
        { role: "human", content: currentChat } as const,
      ];

      setChatHistory(newHistory);
      setCurrentChat("");
    }
  }

  /**
   * Sends a new message to the AI function and streams the response
   */
  const sendMessage = async (message: string) => {
    setState("waiting");

    setChatHistory((chatHistory) => [
      ...chatHistory,
      { role: "human", content: message },
    ]);

    const body = JSON.stringify({
      message,
      chat: 99,
    });

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BEARER_TOKEN}`,
    };

    try {
      const response = await fetch(API_PATH, {
        method: "POST",
        body: body,
        signal: abortController.signal,
        headers: headers,
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.startsWith(JsonContentType)) {
        throw new FatalError(
          `Expected content-type to be application/json, Actual: ${contentType}`
        );
      }

      if (response.ok && response.status === 200) {
        const { text } = await response.json();
        setChatHistory((curr) => [
          ...curr,
          { role: "AI", content: text } as const,
        ]);
        setCurrentChat(null);
        setState("idle");
      } else if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        throw new FatalError();
      } else {
        throw new RetriableError();
      }
    } catch (error) {
      if (error instanceof FatalError) {
        throw error;
      } else {
        // handle other types of errors or rethrow
      }
    } finally {
      setState("idle");
    }
  };

  return { sendMessage, currentChat, chatHistory, cancel, state };
}
