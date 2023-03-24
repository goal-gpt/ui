import React, { SetStateAction, useEffect, useState } from "react";
import { Form } from "react-bootstrap";

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
      setResponses(unsortedResponses.sort(() => Math.random() - 0.5));
    } else {
      // Assumes there is only one blank to fill
      setQuestionType("fill-in-the-blank");
    }
  }, []);

  return (
    <>
      {questionType === "multiple-choice" && [
        <p key={questionItem.question}>{questionItem.question}</p>,
        responses.map((response, i) => (
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
        )),
      ]}
      {questionType === "fill-in-the-blank" && [
        <p key={questionItem.question}>
          {questionItem.question.replace(
            questionItem.correctAnswer,
            "__________"
          )}
        </p>,
        <Form.Group
          className="mb-3"
          controlId={`quiz-question-${questionIndex}-fib`}
          key={`form-group ${questionItem.question}`}
        >
          <Form.Label>Answer</Form.Label>
          <Form.Control
            key={`${questionItem.question} ${questionItem.correctAnswer}`}
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
          />
        </Form.Group>,
      ]}
    </>
  );
}
