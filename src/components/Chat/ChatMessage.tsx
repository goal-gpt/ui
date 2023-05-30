import React from "react";
import ReactMarkdown from "react-markdown";

import styles from "./ChatMessage.module.scss";

export enum ChatRole {
  Human = "human",
  AI = "ai",
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
}
interface Props {
  message: ChatMessage;
}

export function ChatMessage({ message }: Props) {
  const { role, content } = message;
  const roleClass = role === ChatRole.AI ? "chatMessageAI" : "chatMessageHuman";

  return (
    <div className={`${styles.chatMessage} ${styles[roleClass]}`}>
      <ReactMarkdown children={content} />
    </div>
  );
}
