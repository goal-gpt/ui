import React from "react";

import { act, renderWithRouter, screen } from "../../utils/testHelpers";
import { CardItemData } from "../Card";
import { motivationalMessages, QuizModal, QuizModalProps } from ".";

describe("QuizModal", () => {
  let mockHandleClose: jest.Mock;
  let mockCard: CardItemData;
  let mockShow: boolean;
  let testProps: QuizModalProps;

  beforeEach(() => {
    mockCard = {
      link: "https://example.com/",
      imgSrc: "https://example.com/image.jpg",
      title: "Example Card",
      text: "This is an example card.",
      categories: ["category0", "category1"],
      length: 100,
      points: 10,
    };
    mockHandleClose = jest.fn();
    mockShow = true;
    testProps = {
      card: mockCard,
      handleClose: mockHandleClose,
      show: mockShow,
    };
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders the quiz", () => {
    renderWithRouter(<QuizModal {...testProps} />);
    const text = screen.getByText(/Your article/i);
    expect(text).toBeInTheDocument();
  });

  it("displays a motivational message", () => {
    renderWithRouter(<QuizModal {...testProps} />);
    const regex = new RegExp(motivationalMessages.join("|"), "i");
    const messageElement = screen.getByText(regex);
    expect(messageElement).toBeInTheDocument();
  });

  it("counts down correctly", () => {
    renderWithRouter(<QuizModal {...testProps} />);
    const advanceTimers = () => {
      jest.advanceTimersByTime(1000);
    };
    for (let i = 5; i >= 0; i -= 1) {
      const regex = new RegExp(`Your article will open in ${i} seconds.`, "i");
      const textElement = screen.getByText(regex);
      expect(textElement).toBeInTheDocument();
      act(advanceTimers);
    }
  });
});
