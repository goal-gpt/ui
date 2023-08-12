import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "./ChatMessage.module.scss";

export enum ChatRole {
  Human = "human",
  AI = "ai",
}

export interface IChatMessage {
  role: ChatRole;
  content: string;
}
interface Props {
  message: IChatMessage | null;
}

export function ChatMessage({ message }: Props) {
  if (!message) {
    return null;
  }

  const { role, content } = message;
  const roleClass = role === ChatRole.AI ? "chatMessageAI" : "chatMessageHuman";

  return (
    <div className={`${styles.chatMessage} ${styles[roleClass]}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
