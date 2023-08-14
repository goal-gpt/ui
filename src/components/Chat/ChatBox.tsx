import React, { useContext, useRef } from "react";

import { ChatContext } from "./ChatContext";
import { ChatMessage, ChatRole } from "./ChatMessage";

function ChatBox() {
  // The content of the user input message box
  const chatContext = useContext(ChatContext);
  const { chatHistory } = chatContext || {
    chatHistory: [],
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  // Helper functions
  // const scrollToBottom = () => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // Effects
  // TODO: decide if we want this back
  // Send initial message to get Sera's introduction
  // useEffect(() => {
  //   if (chatHistory.length === 0) {
  //     sendMessage("");
  //   }
  // }, []);

  // Scroll to bottom when chat changes
  // useEffect(() => {
  //   scrollToBottom();
  // }, [chatHistory, chatStatus]);

  const getLastAIChat = () => {
    if (chatHistory.length === 0) {
      return null;
    }

    const lastAIChat = chatHistory
      .slice()
      .reverse()
      .find((chat) => chat.role === ChatRole.AI);
    return lastAIChat || null;
  };

  return (
    <div
      className={`mx-auto flex flex-col justify-between overflow-x-hidden px-4`}
    >
      {/* The order of elements is reversed as we want the chat history to appear from the bottom using flex-direction: column-reverse */}
      <div
        className={`flex grow flex-col-reverse flex-nowrap overflow-y-auto overflow-x-hidden`}
        role="log"
      >
        <div ref={bottomRef} className="h-0" />
        <div>
          {/* For now, just show the last AI message */}
          {chatHistory.length > 0 && chatHistory[0]!.content !== "" ? (
            <ChatMessage
              key={chatHistory.length - 1}
              message={getLastAIChat()}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
