import className from "classnames";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export enum ChatRole {
  Human = "human",
  AI = "ai",
}

export interface IChatMessage {
  role: ChatRole;
  content: string;
}
interface Props {
  message: IChatMessage | null;
}

export function ChatMessage({ message }: Props) {
  if (!message) {
    return null;
  }

  const { role, content } = message;

  const messageClass = className({
    "flex flex-col p-2 rounded-md": true,
    "items-start bg-blue-300 dark:bg-blue-700 dark:text-slate-300":
      role === ChatRole.AI,
    "items-end bg-blue-600 dark:bg-blue-300": role === ChatRole.Human,
  });

  const contentClass = className({
    "bg-inherit m-0 p-2 break-words text-left whitespace-pre-wrap": true,
  });

  return (
    <div className={`${messageClass}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} className={`${contentClass}`}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
