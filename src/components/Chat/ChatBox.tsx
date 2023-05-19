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
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, [state]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage = message.trim();
    setMessage("");
    if (newMessage !== "") {
      try {
        await sendMessage(newMessage);
      } catch (err) {
        logger.error(`Error while sending message: ${err}`);
      }
    }
  };

  return (
    <>
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
              className="me-auto"
              placeholder="Send a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button className="w-25" type="submit" variant="secondary">
              Send
            </Button>
          </Stack>
        </Form>
      </Row>
    </>
  );
}

export default ChatBox;
