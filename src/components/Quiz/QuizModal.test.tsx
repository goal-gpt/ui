import React from "react";

import { renderWithRouter, screen } from "../../utils/testHelpers";
import { CardItemData } from "../Card";
import { QuizModal } from ".";

describe("QuizModal", () => {
  const data: CardItemData = {
    link: "https://example.com/",
    imgSrc: "https://example.com/image.jpg",
    title: "Example Card",
    text: "This is an example card.",
    categories: ["category0", "category1"],
    length: 100,
    points: 10,
  };

  it("renders the quiz", () => {
    renderWithRouter(<QuizModal card={data} handleClose={() => ""} show />);
    const quiz = screen.getByText(/Quiz/i);
    expect(quiz).toBeInTheDocument();
  });
});
