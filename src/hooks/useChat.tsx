import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { ChatMessage } from "../components/Chat/ChatMessage";
import { logger } from "../utils";

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
  const [chatID, setChatID] = useState<number | null>(null);

  // Mutation for sending a message to the server
  const sendMessageMutation = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async (message: string) => {
      const body = JSON.stringify({
        message,
        chat: chatID,
      });
      const headers = {
        "Content-Type": JsonContentType,
        Authorization: `Bearer ${BEARER_TOKEN}`,
      };
      return fetch(API_PATH, {
        method: "POST",
        headers,
        body,
      });
    },
    onError: (error: Error) => {
      if (error instanceof FatalError) {
        // Show a user-friendly error message for fatal errors
        logger.error("A serious error occurred. Please try again later.");
      } else if (error instanceof RetriableError) {
        // Attempt to retry the mutation
        logger.error("An error occurred. Retrying...");
        sendMessageMutation.mutate(currentChat || "");
      } else {
        // Log unexpected errors for debugging
        console.error("Unexpected error during sendMessage:", error);
      }
    },
    onSuccess: async (res: Response) => {
      const { chat, text } = await res.json();
      setChatHistory((curr) => [
        ...curr,
        { role: "ai", content: text } as const,
      ]);
      setChatID(chat);
      setCurrentChat(null);
    },
    onSettled: () => {
      setCurrentChat("");
    },
  });

  const sendMessage = (message: string) => {
    if (message !== "") {
      setChatHistory((chatHistory) => [
        ...chatHistory,
        { role: "human", content: message },
      ]);
    }

    sendMessageMutation.mutate(message);
  };

  return {
    sendMessage,
    currentChat,
    chatHistory,
    chatStatus: sendMessageMutation.status,
    chatID,
  };
}
