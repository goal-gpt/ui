import { render, screen } from "@testing-library/react";
import React from "react";

import { cardItemData } from "../../services/mockCardItemData";
import { CardItemData } from "../Card";
import { motivationalMessages, QuizModal, QuizModalProps } from ".";

describe("QuizModal", () => {
  let mockHandleClose: jest.Mock;
  let mockCard: CardItemData;
  let mockShow: boolean;
  let testProps: QuizModalProps;

  beforeEach(() => {
    mockCard = cardItemData[0];
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
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders the quiz", () => {
    render(<QuizModal {...testProps} />);
    const text = screen.getByText(/click here to learn/i);
    expect(text).toBeInTheDocument();
  });

  it("displays a motivational message", () => {
    render(<QuizModal {...testProps} />);
    const regex = new RegExp(motivationalMessages.join("|"), "i");
    const messageElement = screen.getByText(regex);
    expect(messageElement).toBeInTheDocument();
  });
});
