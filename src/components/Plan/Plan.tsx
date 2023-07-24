import { motion } from "framer-motion";
import Link from "next/link";
import React, { useContext } from "react";
import { Accordion, Card, Container } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

import { PlanType, Step } from "../../hooks/useChat";
import { ChatContext } from "../Chat";
import styles from "./Plan.module.scss";

interface StepProps {
  step: Step;
  index: number;
}

export function StepAccordionItem({ step, index }: StepProps) {
  const { name, description, ideas } = step.action;

  return (
    <Accordion.Item className="border-none" eventKey={step.number.toString()}>
      <Accordion.Header className="my-1">{`Step ${index}: ${name} `}</Accordion.Header>
      <Accordion.Body>
        {description && (
          <ReactMarkdown className="mb-0">{description}</ReactMarkdown>
        )}
        {ideas && (
          <>
            <h6 className="my-2">✏️ Ideas</h6>
            <ul className="mb-0">
              {Object.entries(ideas).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </>
        )}
      </Accordion.Body>
    </Accordion.Item>
  );
}

const convertToLinkList = (links: string[]) => {
  return links
    .map((link) => splitLink(link))
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((link) => convertToListItem(link));
};

const splitLink = (link: string) => {
  let [title, url] = link.split("](");
  title = title.replace(/^\[/, "");
  url = url.replace(/\)$/, "");
  return {
    title,
    url,
  };
};

const convertToListItem = (link: { title: string; url: string }) => {
  return (
    <li key={link.url}>
      <Link href={link.url} target="_blank" rel="noreferrer">
        {link.title}
      </Link>
    </li>
  );
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
    <Container>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 2 }}
      >
        <Card className={`${styles.card}`}>
          <Card.Header>
            <Card.Title className={`${styles.goal}`}>
              {currentPlan.goal}
            </Card.Title>
          </Card.Header>
          <Card.Body className={`${styles.stepContainer}`}>
            {currentPlan.steps && currentPlan.steps.length > 0 && (
              <Accordion
                flush={true}
                defaultActiveKey={currentPlan.steps[0].number.toString()}
              >
                {currentPlan.steps.map((step) => (
                  <StepAccordionItem
                    key={step.number}
                    step={step}
                    index={step.number}
                  />
                ))}
              </Accordion>
            )}

            {currentPlan.links && currentPlan.links.length > 0 && (
              <div>
                <h6 className="my-2">🔗 Our sources</h6>
                <ul>{convertToLinkList(currentPlan.links)}</ul>
              </div>
            )}
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
}
