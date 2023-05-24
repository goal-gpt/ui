import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import { ArrowUpRightCircle } from "react-bootstrap-icons";

import { useChat } from "../../hooks/useChat";
import { logger } from "../../utils";
import { Button } from "../Button";
import { Loading } from "../Loading";
import styles from "./ChatBox.module.scss";
import { ChatMessage } from "./ChatMessage";

function ChatBox() {
  // The content of the user input message box
  const [message, setMessage] = useState<string>("");
  const { chatHistory, sendMessage, state } = useChat();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistory.length === 0) {
      sendMessage("");
    }
  }, []);

  useEffect(() => {
    focusInput();
  }, [state]);

  useEffect(() => {
    resetInput();
  }, [message]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, state]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (state === "loading") {
      return;
    }

    const newMessage = message.trim();
    setMessage("");
    if (newMessage !== "") {
      scrollToBottom();
      try {
        sendMessage(newMessage);
      } catch (err) {
        logger.error(`Error while sending message: ${err}`);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      await handleFormSubmit(e);
    }
  };

  const showSpinner =
    (chatHistory.at(-1)?.role === "human" && state === "loading") ||
    (chatHistory.length === 0 && state === "idle");
  const error = state === "error";

  return (
    <Container className="d-flex flex-column mt-5">
      <Row className={`${styles.chatBox}`} role="log">
        <div className={`${styles.chatHistoryContainer}`}>
          {chatHistory.map((chat, i) => (
            <ChatMessage key={i} message={chat} />
          ))}
        </div>
        {showSpinner ? <Loading /> : null}
        {error ? (
          <Row className="justify-content-center my-3">
            <Col className="text-center">
              <p className="text-danger">
                Sorry, an error occurred. Please try again!
              </p>
            </Col>
          </Row>
        ) : null}
      </Row>
      <Row className="mt-4">
        <div ref={bottomRef} style={{ height: 0 }} />
        <Form onSubmit={handleFormSubmit} role="form">
          <Stack direction="horizontal" gap={2}>
            <Form.Control
              as="textarea"
              className={`me-auto ${styles.textArea}`}
              placeholder="Send a message"
              rows={1}
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <Button
              className="w-auto"
              type="submit"
              variant="secondary"
              disabled={state === "loading"}
            >
              <ArrowUpRightCircle />
            </Button>
          </Stack>
        </Form>
        <div>
          <p className="text-center">
            <small>
              Sera may produce inaccurate information about people, places or
              facts.
            </small>
          </p>
        </div>
      </Row>
    </Container>
  );
}

export default ChatBox;
