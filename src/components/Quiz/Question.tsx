import React, { SetStateAction, useEffect, useState } from "react";
import { FloatingLabel, Form, Row } from "react-bootstrap";

import { QuestionItem } from "../Card";

export type QuestionType = "multiple-choice" | "fill-in-the-blank";

export interface QuestionProps {
  questionItem: QuestionItem;
  questionIndex: number;
  formValues: object;
  setFormValues: React.Dispatch<SetStateAction<object>>;
}

export function Question({
  questionItem,
  questionIndex,
  formValues,
  setFormValues,
}: QuestionProps) {
  const [responses, setResponses] = useState<string[]>([]);
  const [formValue, setFormValue] = useState("");
  const [questionType, setQuestionType] =
    useState<QuestionType>("multiple-choice");

  useEffect(() => {
    if (questionItem.incorrectAnswers) {
      const unsortedResponses = [questionItem.correctAnswer].concat(
        questionItem.incorrectAnswers
      );

      // Try to ensure responses with "all" or "none" of the above
      // are at the bottom
      const responsesWithAbove = unsortedResponses.filter((r) =>
        r.includes("above")
      );
      const responsesWithoutAbove = unsortedResponses.filter(
        (r) => !r.includes("above")
      );
      const randomizedResponses = responsesWithoutAbove.sort(
        () => Math.random() - 0.5
      );

      setResponses(randomizedResponses.concat(responsesWithAbove));
    } else {
      // Assumes there is only one blank to fill
      setQuestionType("fill-in-the-blank");
    }
  }, []);

  return (
    <Row>
      {questionType === "multiple-choice" && (
        <Form.Group className="mb-3">
          <Form.Label>
            <div className="mb-2">
              {questionIndex + 1}. {questionItem.question}
            </div>
          </Form.Label>
          {responses.map((response, i) => (
            <Form.Check
              key={`${questionItem.question} ${response}`}
              type="radio"
              id={`quiz-question-${questionIndex}-${i}`}
              label={response}
              value={response}
              name={questionItem.question}
              checked={formValue === response}
              onChange={(e) => {
                // Set value for this questionItem
                setFormValue(e.target.value);

                // Set values for the quiz
                setFormValues({
                  ...formValues,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          ))}
        </Form.Group>
      )}
      {questionType === "fill-in-the-blank" && (
        // TODO: make creating the blank case-insensitive
        <Form.Group
          className="mb-3"
          controlId={`quiz-question-${questionIndex}-fib`}
        >
          <Form.Label
            htmlFor={`${questionItem.question} ${questionItem.correctAnswer}`}
          >
            <div className="mb-3">
              {questionIndex + 1}.{" "}
              {questionItem.question.replace(
                questionItem.correctAnswer,
                "__________"
              )}
            </div>
          </Form.Label>
          <FloatingLabel
            controlId={`${questionItem.question} ${questionItem.correctAnswer}`}
            label="Your answer"
          >
            <Form.Control
              id={`${questionItem.question} ${questionItem.correctAnswer}`}
              name={questionItem.question}
              onChange={(e) => {
                // Set value for this questionItem
                setFormValue(e.target.value);

                // Set values for the quiz
                setFormValues({
                  ...formValues,
                  [e.target.name]: e.target.value,
                });
              }}
              placeholder="Your answer here"
              type="text"
            />
          </FloatingLabel>
        </Form.Group>
      )}
    </Row>
  );
}
