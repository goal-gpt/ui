import React, { createContext } from "react";

import { ChatHook, useChat } from "../../hooks/useChat";

type ChatProviderProps = {
  children: React.ReactNode;
};

export const ChatContext = createContext<ChatHook | null>(null);

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const chat = useChat();
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};
