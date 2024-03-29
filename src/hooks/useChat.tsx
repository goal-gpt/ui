import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type { IChatMessage } from "../components/Chat/ChatMessage";
import { ChatRole } from "../components/Chat/ChatMessage";
import { getLocalStorage, setLocalStorage } from "../services/browserTools";
import { BASE_FUNCTION_URL, BEARER_TOKEN } from "../services/server";
import { logger } from "../utils/logger";

const API_PATH = `${BASE_FUNCTION_URL}/sera`;

const JsonContentType = "application/json";

export class FatalError extends Error {}
export class RetriableError extends Error {}

// Using a different QueryStatus from tanstack because they use "idle" despite it not being part of their QueryStatus
export enum QueryStatus {
  Idle = "idle",
  Loading = "loading",
  Error = "error",
  Success = "success",
}

export type StepAction = {
  name: string;
  description: string;
  ideas: Record<string, string>;
};

export type Step = {
  number: number;
  action: StepAction;
};

// TODO: add date updated to plan
// TODO: make links into their own type
export type PlanType = {
  goal: string;
  steps: Step[];
  links?: string[];
};

export type ChatResponse = {
  chat: number | null; // TODO: convert to -1 for no chat
  text: string;
  plan?: PlanType;
  links?: string[];
};

export interface ChatHook {
  sendMessage: (message: string) => void;
  currentChat: string;
  currentPlan: PlanType;
  chatHistory: IChatMessage[];
  chatStatus: QueryStatus;
  chatID?: number;
}

/**
 * A custom hook to handle the chat state and logic
 */
export function useChat() {
  const [currentChat, setCurrentChat] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<IChatMessage[]>([]);
  const [chatID, setChatID] = useState<number | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanType>({
    goal: "",
    steps: [],
  });

  const getInitialResponse = (): ChatResponse => {
    const storedResponse = getLocalStorage("chatResponse");
    if (storedResponse) {
      return JSON.parse(storedResponse);
    }
    return {
      chat: null,
      text: "",
      plan: {
        goal: "",
        steps: [],
      },
    };
  };

  const [response, setResponse] = useState<ChatResponse>(getInitialResponse);

  // Effects
  useEffect(() => {
    setLocalStorage("chatResponse", JSON.stringify(response));
    const { chat: resChatID, text, plan, links } = response;
    if (plan) {
      let planObj: object = plan;
      if (links) {
        planObj = { ...plan, links };
      }
      setCurrentPlan(planObj as PlanType);
    }
    if (text && text !== "") {
      setChatHistory((curr) => [
        ...curr,
        { role: ChatRole.AI, content: text } as const,
      ]);
    }
    setChatID(resChatID);
    setCurrentChat("");
  }, [response]);

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
        logger.error("Unexpected error during sendMessage:", error);
      }
    },
    onSuccess: async (res: Response) => {
      const { chat: resChatID, text, plan, links } = await res.json();
      setResponse({ chat: resChatID, text, plan, links } as ChatResponse);
    },
    onSettled: () => {
      setCurrentChat("");
    },
  });

  const sendMessage = (message: string) => {
    if (message !== "") {
      setChatHistory((originalChatHistory) => [
        ...originalChatHistory,
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
