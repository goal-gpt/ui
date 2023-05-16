// import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useMemo, useState } from "react";

import { ChatMessage } from "../components/Chat/ChatMessage";

// import { appConfig } from "../../config.browser";

const API_PATH = "http://localhost:50321/functions/v1/sera";

// const EventStreamContentType = "text/event-stream";
const JsonContentType = "application/json";

class FatalError extends Error {}
class RetriableError extends Error {}

/**
 * A custom hook to handle the chat state and logic
 */
export function useChat() {
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<"idle" | "waiting" | "loading">("idle");

  // Lets us cancel the stream
  const abortController = useMemo(() => new AbortController(), []);

  /**
   * Cancels the current chat and adds the current chat to the history
   */
  function cancel() {
    setState("idle");
    abortController.abort();
    if (currentChat) {
      const newHistory = [
        ...chatHistory,
        { role: "user", content: currentChat } as const,
      ];

      setChatHistory(newHistory);
      setCurrentChat("");
    }
  }

  /**
   * Clears the chat history
   */

  function clear() {
    console.log("clearing chat history");
    setChatHistory([]);
  }

  /**
   * Sends a new message to the AI function and streams the response
   */
  const sendMessage = async (
    message: string,
    chatHistory: Array<ChatMessage>
  ) => {
    setState("waiting");
    let chatContent = "";
    const newHistory = [
      ...chatHistory,
      { role: "user", content: message } as const,
    ];

    setChatHistory(newHistory);
    const body = JSON.stringify({
      // Only send the most recent messages. This can also
      // be done in the serverless function, but we do it here
      // to avoid sending too much data
      // TODO: we can also send in a chunk of history
      // messages: newHistory.slice(-appConfig.historyLength),
      query: message,
    });

    try {
      const response = await fetch(API_PATH, {
        method: "POST",
        body: body,
        signal: abortController.signal,
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.startsWith(JsonContentType)) {
        throw new FatalError(
          `Expected content-type to be application/json, Actual: ${contentType}`
        );
      }

      if (response.ok && response.status === 200) {
        const data = await response.json();
        chatContent = data;
        setChatHistory((curr) => [
          ...curr,
          { role: "assistant", content: chatContent } as const,
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

    // `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/clippy-search`
    // await fetchEventSource(API_PATH, {
    //   body,
    //   method: "POST",
    //   signal: abortController.signal,
    //   onopen: async (response) => {
    //     const contentType = response.headers.get("content-type");
    //     if (!contentType?.startsWith(EventStreamContentType)) {
    //       throw new FatalError(
    //         `Expected content-type to be text/event-stream, Actual: ${contentType}`
    //       );
    //     }
    //     if (response.ok && response.status === 200) {
    //       return; // everything's good
    //     }
    //     if (
    //       response.status >= 400 &&
    //       response.status < 500 &&
    //       response.status !== 429
    //     ) {
    //       // client-side errors are usually non-retriable:
    //       throw new FatalError();
    //     }

    //     throw new RetriableError();
    //   },
    //   onclose: () => {
    //     setState("idle");
    //   },
    //   onerror: (err) => {
    //     if (err instanceof FatalError) {
    //       throw err; // rethrow to stop the operation
    //     } else {
    //       // do nothing to automatically retry. You can also
    //       // return a specific retry interval here.
    //     }
    //   },
    //   onmessage: (event) => {
    //     switch (event.event) {
    //       case "delta": {
    //         // This is a new word or chunk from the AI
    //         setState("loading");
    //         const message = JSON.parse(event.data);
    //         if (message?.role === "assistant") {
    //           chatContent = "";
    //           return;
    //         }
    //         if (message.content) {
    //           chatContent += message.content;
    //           setCurrentChat(chatContent);
    //         }
    //         break;
    //       }
    //       case "open": {
    //         // The stream has opened and we should recieve
    //         // a delta event soon. This is normally almost instant.
    //         setCurrentChat("...");
    //         break;
    //       }
    //       case "done": {
    //         // When it's done, we add the message to the history
    //         // and reset the current chat
    //         setChatHistory((curr) => [
    //           ...curr,
    //           { role: "assistant", content: chatContent } as const,
    //         ]);
    //         setCurrentChat(null);
    //         setState("idle");
    //         break;
    //       }
    //       default:
    //         break;
    //     }
    //   },
    // });
  };

  return { sendMessage, currentChat, chatHistory, cancel, clear, state };
}
