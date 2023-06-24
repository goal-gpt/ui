import { motion } from "framer-motion";
import React, { useContext } from "react";
import { Card, Container, ListGroup } from "react-bootstrap";

import { PlanType, Step } from "../../hooks/useChat";
import { ChatContext } from "../Chat";
import styles from "./Plan.module.scss";

interface StepProps {
  step: Step;
  index: number;
}

export function StepComponent({ step, index }: StepProps) {
  const { name, description, ideas } = step.action;

  return (
    <>
      <ListGroup.Item className="border-none" key={name}>
        <h6 className="my-1 text-neutral-dark">{`Step ${index}: ${name} `}</h6>
        {description && <p className="mb-0">{description}</p>}
        {ideas && (
          <ul className="mb-0">
            {Object.entries(ideas).map(([key, value]) => (
              <li key={key}>{value}</li>
            ))}
          </ul>
        )}
      </ListGroup.Item>
    </>
  );
}

const isValidPlan = (plan: PlanType | null): plan is PlanType => {
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
              <ListGroup variant="flush">
                {currentPlan.steps.map((step) => (
                  <StepComponent
                    key={step.number}
                    step={step}
                    index={step.number}
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
