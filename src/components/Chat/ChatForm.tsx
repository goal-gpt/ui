import { useRouter } from "next/router";
import { usePlausible } from "next-plausible";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Form, Spinner } from "react-bootstrap";
import { ArrowUpRightCircle } from "react-bootstrap-icons";

import { QueryStatus } from "../../hooks/useChat";
import { logger } from "../../utils";
import { Button } from "../Button";
import { isValidPlan } from "../Plan";
import { ChatContext } from "./ChatContext";
import styles from "./ChatForm.module.scss";

interface ChatFormProps {
  query: string;
}

function ChatForm({ query = "" }: ChatFormProps) {
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const chatContext = useContext(ChatContext);
  const { currentPlan, sendMessage, chatStatus } = chatContext || {
    sendMessage: () => "",
    chatStatus: QueryStatus.Idle,
  };
  const plausible = usePlausible();

  // Helper functions
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

  // Effects
  // Set query as first message and clear query from URL
  useEffect(() => {
    if (query) {
      sendMessage(query);
      router.push("/", undefined, { shallow: true });
    }
  }, [query, router]);

  // Reset input when message is sent
  useEffect(() => {
    resetInput();
  }, [message]);

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

    if (chatStatus === QueryStatus.Loading) {
      return;
    }

    const newMessage = message.trim();
    setMessage("");
    if (newMessage !== "") {
      try {
        plausible("chatmessage"); // Plausible: Track chat message
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

  return (
    <Container>
      <Form onSubmit={handleFormSubmit} role="form">
        <div className={styles.chatFormContainer}>
          <div className={styles.textAreaWrapper}>
            <Form.Control
              as="textarea"
              className={`${styles.textArea}`}
              placeholder={
                isValidPlan(currentPlan || null)
                  ? "Refine your plan..."
                  : "What plan would you like to make?"
              }
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
            disabled={chatStatus === QueryStatus.Loading}
            height="auto"
            width="auto"
          >
            {chatStatus === QueryStatus.Loading ? (
              <Spinner
                aria-hidden="true"
                as="span"
                animation="border"
                size="sm"
                variant="neutral-dark"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              <ArrowUpRightCircle />
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

ChatForm.defaultProps = {
  query: "",
};

export default ChatForm;
