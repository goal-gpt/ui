import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { QuestionItem } from "../Card";
import { Question, QuestionProps } from "./Question";

const formValues = {};
const setFormValues = jest.fn();

const props = {
  questionIndex: 0,
  formValues,
  setFormValues,
};

describe("Question", () => {
  describe("Multiple-choice", () => {
    const questionItem: QuestionItem = {
      question: "What is the capital of France?",
      correctAnswer: "Paris",
      incorrectAnswers: ["London", "Madrid", "Berlin"],
    };
    const questionProps: QuestionProps = {
      questionItem,
      ...props,
    };

    it("renders a multiple-choice question correctly", () => {
      const { getByText, getByLabelText } = render(
        <Question {...questionProps} />
      );

      expect(
        getByText("1. What is the capital of France?")
      ).toBeInTheDocument();
      expect(getByLabelText("Paris")).toBeInTheDocument();
      expect(getByLabelText("London")).toBeInTheDocument();
      expect(getByLabelText("Madrid")).toBeInTheDocument();
      expect(getByLabelText("Berlin")).toBeInTheDocument();
    });

    it("updates the form values when a multiple-choice question is answered", () => {
      const { getByLabelText } = render(<Question {...questionProps} />);

      fireEvent.click(getByLabelText("Paris"));
      fireEvent.click(getByLabelText("London"));

      expect(setFormValues).toHaveBeenNthCalledWith(1, {
        "What is the capital of France?": "Paris",
      });
      expect(setFormValues).toHaveBeenNthCalledWith(2, {
        "What is the capital of France?": "London",
      });
    });
  });

  describe("Fill-in-the-blank", () => {
    const questionItem: QuestionItem = {
      question: "The capital of France is Paris.",
      correctAnswer: "Paris",
    };
    const questionProps = { questionItem, ...props };

    it("renders a fill-in-the-blank question correctly", () => {
      const { getByText, getByLabelText } = render(
        <Question {...questionProps} />
      );

      expect(
        getByText("1. The capital of France is __________.")
      ).toBeInTheDocument();
      expect(getByLabelText("Your answer")).toBeInTheDocument();
    });

    it("updates the form values when a fill-in-the-blank question is answered", () => {
      const { getByLabelText } = render(<Question {...questionProps} />);

      const answer = "Paris";
      fireEvent.change(getByLabelText("Your answer"), {
        target: { value: answer },
      });

      expect(setFormValues).toHaveBeenCalledWith({
        [questionItem.question]: answer,
      });
    });
  });
});
