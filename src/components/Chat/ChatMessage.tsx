import React from "react";
import { Row } from "react-bootstrap";

import styles from "./ChatMessage.module.scss";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
interface Props {
  message: ChatMessage;
}

export function ChatMessage({ message }: Props) {
  const { role, content } = message;
  const roleClass =
    "chatMessage" + role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <Row>
      <div className={`${styles.chatMessage} ${styles[roleClass]}`}>
        <p>{content}</p>
      </div>
    </Row>
  );
}
