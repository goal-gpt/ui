import React, { SetStateAction, useState } from "react";
import { Form } from "react-bootstrap";

import { Button } from "../Button";
import { CardItemData } from "../Card/CardItem";
import { Question } from "./Question";

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
  const [formValues, setFormValues] = useState({});

  const gradeQuiz = (event: React.FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault();
    if (!card) return false;

    const results = card.questionItems.map((questionItem) => {
      const formValue: string =
        formValues[questionItem.question as keyof object];

      if (!formValue) return false;

      // Make everything lowercase to compare the fill-in-the-blank answers
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
      onSubmit={(event) => {
        const grade = gradeQuiz(event);
        setIsCompleted(grade);
        setShowGrade(true);
      }}
    >
      <div key={`quiz-form ${card?.title}`} className="mb-3">
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
      </div>
    </Form>
  );
}
