import React from "react";
import ReactMarkdown from "react-markdown";

import styles from "./ChatMessage.module.scss";

export interface ChatMessage {
  role: "human" | "ai";
  content: string;
}
interface Props {
  message: ChatMessage;
}

export function ChatMessage({ message }: Props) {
  const { role, content } = message;
  const roleClass = role === "ai" ? "chatMessageAI" : "chatMessageHuman";

  return (
    <div className={`${styles.chatMessage} ${styles[roleClass]}`}>
      <ReactMarkdown children={content} />
    </div>
  );
}
