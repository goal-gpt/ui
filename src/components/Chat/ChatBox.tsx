import React, { useEffect, useRef, useState } from "react";
import { Container, Form, Row, Stack } from "react-bootstrap";

import { useChat } from "../../hooks/useChat";
import { logger } from "../../utils";
import { Button } from "../Button";
import { ChatMessage } from "./ChatMessage";

function ChatBox() {
  // The content of the user input message box
  const [message, setMessage] = useState<string>("");
  const { chatHistory, sendMessage, state } = useChat();

  // Focus the user on the input when state changes
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, [state]);

  useEffect(() => {
    resetInput();
  }, [message]);

  const resetInput = () => {
    console.log(inputRef.current);
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

  return (
    <div className="d-flex flex-column vh-100">
      <Container className="overflow-y-auto flex-grow">
        <Row className="flex flex-col">
          {chatHistory.length === 0 ? (
            <p>
              Welcome to <b>eras</b>! Share any concerns, feelings or ideas
              about money you have with us.
            </p>
          ) : (
            chatHistory.map((chat, i) => <ChatMessage key={i} message={chat} />)
          )}
        </Row>
      </Container>
      <Row className="mt-3">
        <Form onSubmit={handleFormSubmit} role="form">
          <Stack direction="horizontal" gap={2}>
            <Form.Control
              as="textarea"
              className="me-auto"
              placeholder="Send a message"
              rows={1}
              style={{ resize: "none", maxHeight: "12rem", overflowY: "auto" }}
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <Button className="w-25" type="submit" variant="secondary">
              Send
            </Button>
          </Stack>
        </Form>
      </Row>
    </div>
  );
}

export default ChatBox;
