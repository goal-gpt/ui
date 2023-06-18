import React, { useContext, useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { QueryStatus } from "../../hooks/useChat";
import styles from "./ChatBox.module.scss";
import { ChatContext } from "./ChatContext";
import { ChatMessage, ChatRole } from "./ChatMessage";

function ChatBox() {
  // The content of the user input message box
  const chatContext = useContext(ChatContext);
  const { chatHistory, chatStatus } = chatContext || {
    chatHistory: [],
    chatStatus: QueryStatus.Idle,
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effects
  // TODO: decide if we want this back
  // Send initial message to get Sera's introduction
  // useEffect(() => {
  //   if (chatHistory.length === 0) {
  //     sendMessage("");
  //   }
  // }, []);

  // Scroll to bottom when chat changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, chatStatus]);

  const error = chatStatus === QueryStatus.Error;

  const getLastAIChat = () => {
    if (chatHistory.length === 0) {
      return;
    }

    const lastAIChat = chatHistory
      .slice()
      .reverse()
      .find((chat) => chat.role === ChatRole.AI);
    return lastAIChat;
  };

  return (
    <Container className={`${styles.chatContainer}`}>
      {/* The order of elements is reversed as we want the chat history to appear from the bottom using flex-direction: column-reverse*/}
      <Row className={`${styles.chatBox}`} role="log">
        <div ref={bottomRef} style={{ height: 0 }} />
        {error ? (
          <Row className="justify-content-center">
            <Col className="text-center">
              <p className="text-danger">
                Sorry, an error occurred. Please try again!
              </p>
            </Col>
          </Row>
        ) : null}
        <div className={`${styles.chatHistoryContainer}`}>
          {/* For now, just show the last AI message */}
          {chatHistory.length > 0 ? (
            <ChatMessage
              key={chatHistory.length - 1}
              message={getLastAIChat()}
            />
          ) : null}
        </div>
      </Row>
    </Container>
  );
}

export default ChatBox;
