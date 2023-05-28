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

  useEffect(() => {
    const handleKeyUp = () => {
      if (inputRef.current) {
        inputRef.current.style.height = "0";
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      }
    };

    const el = inputRef.current;
    if (!el) return;
    el.addEventListener("keyup", handleKeyUp);

    return () => {
      el.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
      document.documentElement.style.setProperty(
        "--textarea-height",
        `min(12rem, ${inputRef.current.scrollHeight}px)`
      );
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
    <Container className={`${styles.chatContainer}`}>
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
        <div ref={bottomRef} style={{ height: 0 }} />
      </Row>
      <Row className="">
        <Form onSubmit={handleFormSubmit} role="form">
          <div className={styles.textAreaContainer}>
            <Stack
              direction="horizontal"
              gap={2}
              // className={`${styles.messageForm}`}
            >
              <div className={styles.textAreaWrapper}>
                <Form.Control
                  as="textarea"
                  className={`${styles.textArea}`}
                  placeholder="Send a message"
                  rows={1}
                  ref={inputRef}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button
                className={`w-auto ${styles.messageButton}`}
                type="submit"
                variant="secondary"
                disabled={state === "loading"}
                height="none"
              >
                <ArrowUpRightCircle />
              </Button>
            </Stack>
          </div>
        </Form>
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
