import { useRouter } from "next/router";
import { usePlausible } from "next-plausible";
import React, { useContext, useEffect, useRef, useState } from "react";

import { QueryStatus } from "../../hooks/useChat";
import { logger } from "../../utils";
import { isValidPlan } from "../Plan";
import { StatusIndicator } from "../Status";
import { ChatContext } from "./ChatContext";

interface ChatFormProps {
  query: string;
}

function ChatForm({ query = "" }: ChatFormProps) {
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const chatContext = useContext(ChatContext);
  const { currentPlan, sendMessage, chatStatus } = chatContext || {
    currentPlan: null,
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
        `min(12rem, ${inputRef.current.scrollHeight}px)`,
      );
    }
  };

  // Effects
  // Set query as first message and clear query from URL
  useEffect(() => {
    if (query) {
      if (isValidPlan(currentPlan)) {
        // eslint-disable-next-line
        alert(
          "You already have a plan in progress, your message will refine the existing plan. We are in the process of adding functionality for new plans - come back later to check it out!",
        );
        setMessage(query);
      } else {
        sendMessage(query);
      }
      router.push("/", undefined, { shallow: true });
    }
  }, [query]);

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
    if (!el) return () => {};
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
    <div className="container mx-auto px-4">
      <form role="form" onSubmit={handleFormSubmit}>
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>
        <div className="relative rounded-lg ">
          <textarea
            id="chat"
            rows={1}
            className="text-md block w-full rounded-lg  border border-slate-300 bg-white p-4 pr-10 font-medium tracking-wide text-slate-800 shadow-xl transition placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-500 focus:border-blue-500 focus:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-400 dark:focus:border-blue-500"
            placeholder={
              isValidPlan(currentPlan || null)
                ? "Refine your plan..."
                : "What plan would you like to make?"
            }
            spellCheck="false"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="absolute bottom-1.5 right-1.5 cursor-pointer rounded-full p-2  shadow-md hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-slate-600 md:bottom-3 md:right-3 md:p-2"
            disabled={chatStatus === QueryStatus.Loading}
          >
            {chatStatus === QueryStatus.Loading ? (
              <StatusIndicator />
            ) : (
              <>
                <svg
                  className="h-5 w-5 rotate-90 fill-blue-600 dark:fill-blue-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 18 20"
                >
                  <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                </svg>
                <span className="sr-only">Send message</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

ChatForm.defaultProps = {
  query: "",
};

export default ChatForm;
