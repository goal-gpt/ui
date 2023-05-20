import React from "react";
import { Row } from "react-bootstrap";

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
    <Row>
      <div className={`${styles.chatMessage} ${styles[roleClass]}`}>
        <p>{content}</p>
      </div>
    </Row>
  );
}
