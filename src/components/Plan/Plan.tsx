import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { Card, Container, ListGroup } from "react-bootstrap";

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

export function Step({ step, index, expanded, setExpanded }: StepProps) {
  const isOpen = expanded.has(index);
  const [firstSentence, ...rest] = step.action.split(".");

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

  return (
    <>
      <ListGroup.Item
        key={firstSentence}
        onClick={handleClick}
        aria-controls={`fade-text-${index}`}
        aria-expanded={isOpen}
      >
        <p className="my-0 text-neutral-dark">{`${index}. ${firstSentence}.`}</p>
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
              {rest.join(".") + "."}
            </motion.div>
          )}
        </AnimatePresence>
      </ListGroup.Item>
    </>
  );
}

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

  if (!currentPlan || (!currentPlan?.goal && currentPlan.steps?.length === 0)) {
    return <></>;
  }

  return (
    <Container className={`${styles.planContainer}`}>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 2 }}
      >
        <Card className={`${styles.card}`}>
          <Card.Header className={`${styles.planTitle}`}>
            Your action plan
          </Card.Header>
          <Card.Body>
            <Card.Title className={`${styles.goal}`}>
              {currentPlan.goal}
            </Card.Title>
            {currentPlan.steps && currentPlan.steps.length > 0 && (
              <ListGroup variant="flush">
                {currentPlan.steps.map((step) => (
                  <Step
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
