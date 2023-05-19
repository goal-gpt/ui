import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import { ArrowUpRightCircle } from "react-bootstrap-icons";

import { useChat } from "../../hooks/useChat";
import { logger } from "../../utils";
import { Button } from "../Button";
import styles from "./ChatBox.module.scss";
import { ChatMessage } from "./ChatMessage";

function ChatBox() {
  // The content of the user input message box
  const [message, setMessage] = useState<string>("");
  const { chatHistory, sendMessage, state } = useChat();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    focusInput();
  }, [state]);

  useEffect(() => {
    resetInput();
  }, [message]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newMessage = message.trim();
    setMessage("");
    if (newMessage !== "") {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  console.log("state", state);

  return (
    <Container className="d-flex flex-column">
      <div className={`${styles.chatBox}`}>
        {chatHistory.length === 0 ? (
          <p>
            Welcome to <b>eras</b>! Share any concerns, feelings or ideas about
            money you have with us.
          </p>
        ) : (
          chatHistory.map((chat, i) => <ChatMessage key={i} message={chat} />)
        )}
      </div>
      <Row className="align-items-end my-4">
        <Col className="">
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
              <Button className="w-auto" type="submit" variant="secondary">
                <ArrowUpRightCircle />
              </Button>
            </Stack>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatBox;
