import React from "react";
import { Row } from "react-bootstrap";

import styles from "./ChatMessage.module.scss";
// import ReactMarkdown from "react-markdown";

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
        {/* <ReactMarkdown>{content}</ReactMarkdown> */}
        <p>{content}</p>
      </div>
    </Row>
  );
}
