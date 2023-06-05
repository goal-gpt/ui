import React, { useContext, useState } from "react";
import { Container } from "react-bootstrap";

import { ChatContext } from "../Chat";

export function Plan() {
  const chatContext = useContext(ChatContext);
  const { currentPlan } = chatContext || {
    currentPlan: null,
  };
  const [visibleSteps, setVisibleSteps] = useState<Array<boolean>>(
    new Array(currentPlan ? currentPlan.steps.length : 0).fill(false)
  );

  const handleClick = (index: number) => {
    setVisibleSteps((visibleSteps) =>
      visibleSteps.map((isVisible, idx) =>
        idx === index ? !isVisible : isVisible
      )
    );
  };

  if (
    !currentPlan ||
    (currentPlan?.goal === "" && currentPlan?.steps.length === 0)
  ) {
    return <></>;
  }

  return (
    <Container className="my-5">
      <h5>Your plan</h5>
      <p>{currentPlan.goal}</p>
      {currentPlan.steps.length > 0 && (
        <ol>
          {currentPlan.steps.map((step, index) => {
            const [firstSentence, ...rest] = step.action.split(".");
            if (firstSentence === "") {
              return null;
            }

            return (
              <li key={index} onClick={() => handleClick(index)}>
                {`${firstSentence}.`}
                {visibleSteps[index] && rest.length > 0 && (
                  <p>{rest.join(".") + "."}</p>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </Container>
  );
}
