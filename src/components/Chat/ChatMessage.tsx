import React from "react";
import { Row } from "react-bootstrap";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
interface Props {
  message: ChatMessage;
}

export function ChatMessage({ message }: Props) {
  const { role, content } = message;

  return (
    <Row>
      <div className={`chat-message chat-message-${role}`}>
        <p>{content}</p>
      </div>
    </Row>
  );
}
