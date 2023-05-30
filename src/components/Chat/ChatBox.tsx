import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { ArrowUpRightCircle } from "react-bootstrap-icons";

import { useChat } from "../../hooks/useChat";
import { logger } from "../../utils";
import { Button } from "../Button";
import { Loading } from "../Loading";
import styles from "./ChatBox.module.scss";
import { ChatMessage } from "./ChatMessage";

interface ChatBoxProps {
  query: string;
}

function ChatBox({ query = "" }: ChatBoxProps) {
  // The content of the user input message box
  const [message, setMessage] = useState<string>("");
  const { chatHistory, sendMessage, chatStatus } = useChat();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Helper functions
  const focusInput = () => {
    inputRef.current?.focus();
  };

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

  // Effects
  // Set query as first message and clear query from URL
  useEffect(() => {
    if (query) {
      setMessage(query);
      router.push("/", undefined, { shallow: true });
    }
  }, [query, router]);

  // Send initial message to get Sera's introduction
  useEffect(() => {
    if (chatHistory.length === 0) {
      sendMessage("");
    }
  }, []);

  // Focus on input when chatStatus changes
  useEffect(() => {
    focusInput();
  }, [chatStatus]);

  // Reset input when message is sent
  useEffect(() => {
    resetInput();
  }, [message]);

  // Scroll to bottom when chat changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, chatStatus]);

  // Resize textarea to fit content
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

  // Event handlers
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (chatStatus === "loading") {
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
    (chatHistory.at(-1)?.role === "human" && chatStatus === "loading") ||
    (chatHistory.length === 0 && chatStatus === "idle");
  const error = chatStatus === "error";

  return (
    <Container className={`${styles.chatContainer}`}>
      {/* The order of elements is reversed as we want the chat history to appear from the bottom using flex-direction: column-reverse*/}
      <Row className={`${styles.chatBox}`} role="log">
        <div ref={bottomRef} style={{ height: 0 }} />
        {error ? (
          <Row className="justify-content-center my-3">
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
      <Row className="my-3">
        {/* TODO: implement suggestions here */}
        {/* <div className={`${styles.suggestions}`}>Hi!</div> */}
        <Form onSubmit={handleFormSubmit} role="form">
          <div className={styles.textAreaContainer}>
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
              className={`${styles.messageButton}`}
              type="submit"
              variant="secondary"
              disabled={chatStatus === "loading"}
              height="auto"
              width="auto"
            >
              <ArrowUpRightCircle />
            </Button>
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

ChatBox.defaultProps = {
  query: "",
};

export default ChatBox;
