import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { Card, Container, ListGroup } from "react-bootstrap";
import { CaretDown, CaretUp } from "react-bootstrap-icons";

import { PlanType } from "../../hooks/useChat";
import { ChatContext } from "../Chat";
import styles from "./Plan.module.scss";

interface StepProps {
  step: {
    action: string;
  };
  index: number;
  expanded: Set<number>;
  setExpanded: (expanded: Set<number>) => void;
}

export function processSentences(sentences: string[]) {
  if (sentences.length === 0) {
    return;
  }

  const result = sentences.map((sentence) => {
    if (!sentence) {
      return sentence;
    }
    // check if the sentence ends in a punctuation
    if (/[.!?]$/.test(sentence)) {
      return sentence;
    } else {
      // add a "." at the end if there's no punctuation
      return sentence + ".";
    }
  });

  return result.filter(Boolean).join(" ");
}

export function Step({ step, index, expanded, setExpanded }: StepProps) {
  const isOpen = expanded.has(index);
  const [firstSentence, ...rest] = step.action.split(/(?<=[.!?])\s+/);

  const handleClick = () => {
    if (rest.length === 0) {
      return;
    }
    if (isOpen) {
      setExpanded(new Set([...expanded].filter((i) => i !== index)));
    } else {
      setExpanded(new Set([...expanded, index]));
    }
  };

  const variants = {
    open: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 },
  };

  const remainingSentences = processSentences(rest);

  return (
    <>
      <ListGroup.Item
        key={firstSentence}
        onClick={handleClick}
        aria-controls={`fade-text-${index}`}
        aria-expanded={isOpen}
      >
        <p className="my-0 text-neutral-dark">
          {`Step ${index}: ${firstSentence} `}
          {remainingSentences && (isOpen ? <CaretDown /> : <CaretUp />)}
        </p>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              className={`${styles.listItem} text-quaternary`}
              id={`fade-text-${index}`}
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={variants}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              {remainingSentences}
            </motion.div>
          )}
        </AnimatePresence>
      </ListGroup.Item>
    </>
  );
}

const isValidPlan = (plan: PlanType | null) => {
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
  const [expanded, setExpanded] = useState(new Set<number>());

  // If the current plan changes, reset the expanded steps
  useEffect(() => {
    setExpanded(new Set<number>());
  }, [currentPlan?.steps]);

  if (!isValidPlan(currentPlan)) {
    return null;
  }

  if (
    !currentPlan ||
    Object.keys(currentPlan).length === 0 ||
    (currentPlan?.goal === "" && currentPlan.steps?.length === 0)
  ) {
    return <></>;
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
              <ListGroup variant="flush">
                {currentPlan.steps.map((step) => (
                  <Step
                    key={step.number}
                    step={step}
                    index={step.number}
                    expanded={expanded}
                    setExpanded={setExpanded}
                  />
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
}
