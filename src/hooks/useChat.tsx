import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { ChatMessage, ChatRole } from "../components/Chat/ChatMessage";
import { BASE_FUNCTION_URL, BEARER_TOKEN } from "../services/server";
import { logger } from "../utils";

const API_PATH = BASE_FUNCTION_URL + "/sera";

const JsonContentType = "application/json";

export class FatalError extends Error {}
export class RetriableError extends Error {}

export enum QueryStatus {
  Idle = "idle",
  Loading = "loading",
  Error = "error",
  Success = "success",
}

export type Step = {
  number: number;
  action: string;
};

export type PlanType = {
  goal: string;
  steps: Step[];
};

export interface ChatHook {
  sendMessage: (message: string) => void;
  currentChat: string;
  currentPlan: PlanType;
  chatHistory: ChatMessage[];
  chatStatus: QueryStatus;
  chatID?: number;
}

/**
 * A custom hook to handle the chat state and logic
 */
export function useChat() {
  const [currentChat, setCurrentChat] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatID, setChatID] = useState<number | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanType>({
    goal: "",
    steps: [],
  });

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
      const { chat: chatID, text, question, plan } = await res.json();

      const content = question ? text + "\n" + question : text;

      if (plan) {
        setCurrentPlan(plan as PlanType);
      }

      setChatHistory((curr) => [
        ...curr,
        { role: ChatRole.AI, content } as const,
      ]);
      setChatID(chatID);
      setCurrentChat("");
    },
    onSettled: () => {
      setCurrentChat("");
    },
  });

  const sendMessage = (message: string) => {
    if (message !== "") {
      setChatHistory((chatHistory) => [
        ...chatHistory,
        { role: ChatRole.Human, content: message },
      ]);
    }

    sendMessageMutation.mutate(message);
  };

  return {
    sendMessage,
    currentChat,
    currentPlan,
    chatHistory,
    chatStatus: sendMessageMutation.status as QueryStatus,
    chatID,
  } as ChatHook;
}
