import {
  Matcher,
  render,
  SelectorMatcherOptions,
} from "@testing-library/react";
import React from "react";

import Profile from "../pages/profile";
import { cardItemData } from "../src/services/cardItemData";

jest.mock("../src/services/cardItemData", () => {
  const {
    cardItemData: mockCards,
  } = require("../src/services/mockCardItemData"); // eslint-disable-line @typescript-eslint/no-var-requires

  return {
    cardItemData: mockCards,
  };
});

describe("Profile", () => {
  describe("There are no completed quizzes", () => {
    it("renders a message when no quizzes have been completed", () => {
      const { getByText } = render(<Profile />);
      const messageElement = getByText(
        /once you've completed some quizzes, come back here to track your progress!/i
      );
      expect(messageElement).toBeInTheDocument();
    });
  });

  describe("There are completed quizzes", () => {
    let getByTextHTMLElement: (
      id: Matcher,
      options?: SelectorMatcherOptions | undefined
    ) => HTMLElement;
    beforeEach(() => {
      const completedCardLinks = cardItemData
        .slice(0, 2)
        .map((card) => card.link);
      jest
        .spyOn(Object.getPrototypeOf(window.localStorage), "getItem")
        .mockReturnValue(JSON.stringify(completedCardLinks));

      const { getByText } = render(<Profile />);
      getByTextHTMLElement = getByText;
    });

    it("displays the number of quizzes completed when at least one quiz is completed", () => {
      const quizzesCompletedElement = getByTextHTMLElement(
        /# of quizzes completed: 2/i
      );
      expect(quizzesCompletedElement).toBeInTheDocument();
    });

    it("displays the number of categories covered when at least one quiz is completed", () => {
      const categoriesCoveredElement = getByTextHTMLElement(
        /# of categories covered: 4/i
      );
      expect(categoriesCoveredElement).toBeInTheDocument();
    });

    it("displays the number of quizzes per covered category when at least one quiz is completed", () => {
      const quizzesPerCategoryElement = getByTextHTMLElement(
        /# of quizzes per covered category/i
      );
      expect(quizzesPerCategoryElement).toBeInTheDocument();
      const category0 = getByTextHTMLElement("category0: 1");
      expect(category0).toBeInTheDocument();
      const category1 = getByTextHTMLElement("category1: 2");
      expect(category1).toBeInTheDocument();
    });

    it("displays the amount of consumed content when at least one quiz is completed", () => {
      const consumedContentElement = getByTextHTMLElement(
        /amount of tested content: over 200 words/i
      );
      expect(consumedContentElement).toBeInTheDocument();
    });
  });
});
