import type { SetStateAction } from "react";
import React, { useState } from "react";
import { Form } from "react-bootstrap";

import { Button } from "../Button";
import type { CardItemData } from "../Card/CardItem";
import { Question } from "./Question";

export interface QuizFormValues {
  [key: string]: string;
}

export interface QuizFormProps {
  setIsCompleted: React.Dispatch<SetStateAction<boolean>>;
  setShowGrade: React.Dispatch<SetStateAction<boolean>>;
  card: CardItemData | null;
}

export function QuizForm({
  setIsCompleted,
  setShowGrade,
  card,
}: QuizFormProps) {
  const [formValues, setFormValues] = useState<QuizFormValues>({});

  const gradeQuiz = (event: React.FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault();
    if (!card) return false;

    const results = card.questionItems.map((questionItem) => {
      const formValue: string = formValues[questionItem.question];

      if (!formValue) return false;

      // Make everything lowercase to compare the fill-in-the-blank answers
      // TODO: we need a more robust way to compare answers, because something like "high-interest debt" should match "high interest debt"
      return (
        formValue.toLowerCase() === questionItem.correctAnswer.toLowerCase()
      );
    });

    // Set grade to false if any answers are incorrect
    return !results.some((result) => {
      return result === false;
    });
  };

  return (
    <Form
      className="mb-3"
      onSubmit={(event) => {
        const grade = gradeQuiz(event);
        setIsCompleted(grade);
        setShowGrade(true);
      }}
    >
      {card?.questionItems.map((questionItem, i) => (
        <Question
          key={questionItem.question}
          questionItem={questionItem}
          questionIndex={i}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      ))}
      <Button type="submit">Submit</Button>
    </Form>
  );
}
