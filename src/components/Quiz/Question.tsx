import type { SetStateAction } from "react";
import React, { useEffect, useState } from "react";
import { FloatingLabel, Form, Row } from "react-bootstrap";

import type { QuestionItem } from "../Card";
import type { QuizFormValues } from "./QuizForm";

export type QuestionType = "multiple-choice" | "fill-in-the-blank";

export interface QuestionProps {
  questionItem: QuestionItem;
  questionIndex: number;
  formValues: object;
  setFormValues: React.Dispatch<SetStateAction<QuizFormValues>>;
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
        questionItem.incorrectAnswers,
      );

      // Try to ensure responses with "all" or "none" of the above are at the bottom
      const responsesWithAbove = unsortedResponses.filter((r) =>
        r.includes("above"),
      );
      const responsesWithoutAbove = unsortedResponses.filter(
        (r) => !r.includes("above"),
      );
      const randomizedResponses = responsesWithoutAbove.sort(
        () => Math.random() - 0.5,
      );

      setResponses(randomizedResponses.concat(responsesWithAbove));
    } else {
      // Assumes there is only one blank to fill
      setQuestionType("fill-in-the-blank");
    }
  }, []);

  const blankSpan = (
    <span style={{ borderBottom: "1px solid" }}>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
  );

  const questionWithBlankSpan = (
    question: string,
    answer: string,
  ): JSX.Element => {
    const answerIndex = question.indexOf(answer);
    const questionBeforeBlank = question.substring(0, answerIndex);
    const questionAfterBlank = question.substring(answerIndex + answer.length);

    return (
      <>
        {questionBeforeBlank}
        {blankSpan}
        {questionAfterBlank}
      </>
    );
  };

  const getQuestionWithBlankUnderscores = (
    question: string,
    answer: string,
  ): string => {
    return question.replace(answer, "__________");
  };

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
              id={`quiz-question-${questionIndex}-mc-${i}`}
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
        <Form.Group className="mb-3">
          <Form.Label>
            <div className="mb-3">
              {questionIndex + 1}.{" "}
              {questionWithBlankSpan(
                questionItem.question,
                questionItem.correctAnswer,
              )}
            </div>
          </Form.Label>
          <FloatingLabel
            controlId={`quiz-question-${questionIndex}-fib`}
            label="Your answer"
          >
            <Form.Control
              name={getQuestionWithBlankUnderscores(
                questionItem.question,
                questionItem.correctAnswer,
              )}
              onChange={(e) => {
                // Set value for this questionItem
                setFormValue(e.target.value);

                // Set values for the quiz
                setFormValues({
                  ...formValues,
                  [questionItem.question]: e.target.value,
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
