import { motion } from "framer-motion";
import Link from "next/link";
import React, { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";

import type { PlanType, Step } from "../../hooks/useChat";
import { ChatContext } from "../Chat/ChatContext";

interface StepProps {
  step: Step;
  index: number;
}

export function StepAccordionItem({ step, index }: StepProps) {
  const { name, description, ideas } = step.action;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        className={`flex w-full items-center justify-between rounded-lg p-4 text-left${
          isOpen && " bg-blue-100"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {`Step ${index}: ${name} `}
        <span>{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-2">
          {description && (
            <ReactMarkdown linkTarget="_blank">{description}</ReactMarkdown>
          )}
          {ideas && (
            <>
              <h6 className="my-2">✏️ Ideas</h6>
              <ul className="list-image-checkmark pl-5">
                {Object.entries(ideas).map(([key, value]) => (
                  <li className="my-1 ml-2" key={key}>
                    {value}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const splitLink = (link: string) => {
  let [title, url] = link.split("](");
  title = title?.replace(/^\[/, "");
  url = url?.replace(/\)$/, "");
  return {
    title,
    url,
  };
};

const convertToListItem = (link?: { title: string; url: string }) => {
  if (!link) return null;
  return (
    <li key={link.url}>
      <Link
        className="font-medium text-blue-600 underline transition-all duration-300 hover:text-blue-700 hover:decoration-transparent dark:text-blue-500 hover:dark:text-blue-400"
        href={link.url}
        target="_blank"
        rel="noreferrer"
      >
        {link.title}
      </Link>
    </li>
  );
};
const convertToLinkList = (links: string[]) => {
  return links
    .map((link) => splitLink(link))
    .sort((a, b) => a.title?.localeCompare(b.title || "") || 0)
    .map((link) => convertToListItem(link as { title: string; url: string }));
};

export const isValidPlan = (plan: PlanType | null): plan is PlanType => {
  const isNullOrUndefined = !plan;
  const isEmptyObject = !isNullOrUndefined && Object.keys(plan).length === 0;
  const hasEmptyGoalAndSteps =
    !isNullOrUndefined && plan.goal === "" && plan.steps?.length === 0;

  return !isNullOrUndefined && !isEmptyObject && !hasEmptyGoalAndSteps;
};

export function Plan() {
  const chatContext = useContext(ChatContext);
  const { currentPlan } = chatContext || {
    currentPlan: null,
  };

  if (!isValidPlan(currentPlan)) {
    return null;
  }

  return (
    <div className="mx-auto px-4">
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 2 }}
      >
        <div className={`rounded border`}>
          <div className="bg-gray-100 p-4">
            <h2 className={`text-center text-xl text-blue-800`}>
              {currentPlan.goal}
            </h2>
          </div>
          <div className={`p-4`}>
            {currentPlan.steps && currentPlan.steps.length > 0 && (
              <div>
                {currentPlan.steps.map((step) => (
                  <StepAccordionItem
                    key={step.number}
                    step={step}
                    index={step.number}
                  />
                ))}
              </div>
            )}

            {currentPlan.links && currentPlan.links.length > 0 && (
              <div>
                <h6 className="my-2">🔗 Our sources</h6>
                <ul>{convertToLinkList(currentPlan.links)}</ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
