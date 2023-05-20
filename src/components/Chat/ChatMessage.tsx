import React from "react";
import { Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

import styles from "./ChatMessage.module.scss";
// import remarkGfm from "remark-gfm";

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
    <Row>
      <div className={`${styles.chatMessage} ${styles[roleClass]}`}>
        <ReactMarkdown children={content} />
      </div>
    </Row>
  );
}
