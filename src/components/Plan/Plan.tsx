import { motion } from "framer-motion";
import Link from "next/link";
import React, { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";

import type { PlanType, Step } from "../../hooks/useChat";
import { ChatContext } from "../Chat/ChatContext";

interface StepProps {
  step: Step;
  index: number;
  isFirst: boolean;
}

export function StepAccordionItem({ step, index, isFirst }: StepProps) {
  const { name, description, ideas } = step.action;
  const [isOpen, setIsOpen] = useState(isFirst || false);

  return (
    <div
      className={`${
        isFirst || isOpen ? "" : " border-t dark:border-slate-700"
      }`}
    >
      <button
        className={`flex w-full items-center justify-between rounded-lg p-4 text-left text-slate-800 transition hover:bg-blue-50 dark:text-slate-300${
          isOpen
            ? " bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700"
            : " hover:bg-blue-50 dark:hover:bg-blue-900"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {`Step ${index}: ${name} `}
        <span className="dark:text-slate-300">{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-2 dark:bg-slate-800 dark:text-slate-200">
          {description && (
            <ReactMarkdown linkTarget="_blank">{description}</ReactMarkdown>
          )}
          {ideas && (
            <>
              <h6 className="my-2 dark:text-gray-400">✏️ Ideas</h6>
              <ul className="list-image-checkmark pl-5">
                {Object.entries(ideas).map(([key, value]) => (
                  <li className="my-1 ml-2 dark:text-gray-300" key={key}>
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
        <div className="rounded border bg-slate-50 shadow-xl dark:border-slate-700 dark:bg-slate-800">
          <div className="bg-slate-100 p-4 dark:bg-slate-700">
            <h2
              className={`text-center text-xl font-medium text-blue-800 dark:text-blue-200`}
            >
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
                    isFirst={step.number === 1}
                  />
                ))}
              </div>
            )}

            {currentPlan.links && currentPlan.links.length > 0 && (
              <div>
                <h6 className="my-2 text-slate-800  dark:text-slate-300">
                  🔗 Our sources
                </h6>
                <ul className="text-gray-800 dark:text-gray-300">
                  {convertToLinkList(currentPlan.links)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
