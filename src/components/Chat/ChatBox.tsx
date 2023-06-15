import React, { useContext, useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { QueryStatus } from "../../hooks/useChat";
import { Loading } from "../Loading";
import styles from "./ChatBox.module.scss";
import { ChatContext } from "./ChatContext";
import ChatForm from "./ChatForm";
import { ChatMessage, ChatRole } from "./ChatMessage";

function ChatBox() {
  // The content of the user input message box
  const chatContext = useContext(ChatContext);
  const { chatHistory, sendMessage, chatStatus } = chatContext || {
    chatHistory: [],
    sendMessage: () => "",
    chatStatus: QueryStatus.Idle,
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effects
  // Send initial message to get Sera's introduction
  useEffect(() => {
    if (chatHistory.length === 0) {
      sendMessage("");
    }
  }, []);

  // Scroll to bottom when chat changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, chatStatus]);

  const showSpinner =
    (chatHistory.at(-1)?.role === ChatRole.Human &&
      chatStatus === QueryStatus.Loading) ||
    (chatHistory.length === 0 && chatStatus === QueryStatus.Idle);
  const error = chatStatus === QueryStatus.Error;

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
        {showSpinner ? <Loading /> : null}
        <div className={`${styles.chatHistoryContainer}`}>
          {chatHistory.map((chat, i) => (
            <ChatMessage key={i} message={chat} />
          ))}
        </div>
      </Row>
      <Row className="mt-3">
        {/* TODO: implement suggestions here */}
        {/* <div className={`${styles.suggestions}`}>Hi!</div> */}
        <ChatForm />
        <div>
          <p className="text-center me-4">
            <small>
              Sera tries her best to ensure accuracy - please verify her
              information for your peace of mind.
            </small>
          </p>
        </div>
      </Row>
    </Container>
  );
}

export default ChatBox;
