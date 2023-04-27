import { fireEvent, render } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import { cardItemData } from "../../services/mockCardItemData";
import { CardList, CardListProps } from "./CardList";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

function simulateSwipeLeft(element: ChildNode) {
  fireEvent.mouseDown(element, { clientX: 1000, clientY: 100 });

  // Simulate the movement of the swipe
  fireEvent.mouseMove(element, { clientX: 50, clientY: 100 });

  // Simulate the end of the swipe
  fireEvent.mouseUp(element);
}

describe("CardList component", () => {
  let mockSelectCard: jest.Mock;
  let mockRemoveCard: jest.Mock;
  let mockCardListProps: CardListProps;

  beforeEach(() => {
    mockSelectCard = jest.fn();
    mockRemoveCard = jest.fn();
    mockCardListProps = {
      cardItemData,
      selectCard: mockSelectCard,
      removeCard: mockRemoveCard,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a list of all cards if no category is supplied", () => {
    const query = {};
    (useRouter as jest.Mock).mockReturnValue({ query });

    const { getByRole } = render(<CardList {...mockCardListProps} />);
    const cardItems = getByRole("list");
    // TODO: this is flaky because it depends on how nested we put the CardItem components
    expect(cardItems.childNodes.length).toBe(3);
  });

  it("renders a list of cards with the matching category", () => {
    const query = { category: "category0" };
    (useRouter as jest.Mock).mockReturnValue({ query });

    const { getByRole } = render(<CardList {...mockCardListProps} />);
    const cardItems = getByRole("list");
    expect(cardItems.childNodes.length).toBe(1);
  });

  it("renders a list of cards with the matching category hyphen-insensitive", () => {
    const query = { category: "category-3" };
    (useRouter as jest.Mock).mockReturnValue({ query });

    const { getByRole } = render(<CardList {...mockCardListProps} />);
    const cardItems = getByRole("list");
    expect(cardItems.childNodes.length).toBe(2);
  });

  it("renders an error page when there is no matching category", () => {
    const query = { category: "not-a-matching-category" };
    (useRouter as jest.Mock).mockReturnValue({ query });

    expect(() => render(<CardList {...mockCardListProps} />)).toThrow(
      "Sorry, we do not have any content in that category. But please check back later. We are constantly adding new content!"
    );
  });

  describe("there are no more cards to show", () => {
    beforeEach(() => {
      const query = { category: "category-3" };
      (useRouter as jest.Mock).mockReturnValue({ query });
    });

    it("displays a message about reaching the end", () => {
      const { getByRole, getByLabelText, getByText } = render(
        <CardList {...mockCardListProps} />
      );
      const cardItems = getByRole("list");
      const leftButton = getByLabelText("left-button");

      for (let index = 0; index < cardItems.childNodes.length; index++) {
        fireEvent.click(leftButton);
      }

      const reachedTheEndText = getByText(
        "Looks like you've reached the end. Please check back later. We add new content regularly!"
      );

      expect(reachedTheEndText).toBeInTheDocument();
    });

    it("provides a link to reset skipped or missed cards if cards have been skipped", () => {
      const { getByRole, getByLabelText, queryByLabelText } = render(
        <CardList {...mockCardListProps} />
      );
      const cardItems = getByRole("list");
      const leftButton0 = getByLabelText("left-button");

      for (let index = 0; index < cardItems.childNodes.length; index++) {
        fireEvent.click(leftButton0);
      }
      const leftButtonAfterSkips = queryByLabelText("left-button");

      expect(leftButtonAfterSkips).toBeNull();
      const reviewLink = getByLabelText("review-link");
      expect(reviewLink).toBeInTheDocument();

      fireEvent.click(reviewLink);
      const leftButtonAfterClickingReviewLink = getByLabelText("left-button");
      expect(leftButtonAfterClickingReviewLink).toBeInTheDocument();
    });

    it("provides a link to reset skipped or missed cards if cards have been missed", () => {
      // TODO
    });

    it("provides a link to uncompleted cards in all categories if there are any uncompleted cards in other categories", () => {
      const { getByRole, getByLabelText } = render(
        <CardList {...mockCardListProps} />
      );
      const cardItems = getByRole("list");

      for (let index = 0; index < cardItems.childNodes.length; index++) {
        simulateSwipeLeft(cardItems.childNodes[index]);
      }

      const allCategoriesLink = getByLabelText("all-categories-link");
      expect(allCategoriesLink).toBeInTheDocument();

      fireEvent.click(allCategoriesLink);
      // TODO: test that after the clicking the link, user is routed to view with cards in all categories with uncompleted cards
    });

    it("does not provide a link to uncompleted cards in all categories if there are no uncompleted cards in other categories", () => {
      // Mock that the first card item, which is not category-3, is completed
      // So there are no uncompleted cards in other categories
      jest
        .spyOn(Object.getPrototypeOf(window.localStorage), "getItem")
        .mockReturnValue(JSON.stringify([cardItemData[0].link]));

      const { getByRole, queryByLabelText } = render(
        <CardList {...mockCardListProps} />
      );
      const cardItems = getByRole("list");

      for (let index = 0; index < cardItems.childNodes.length; index++) {
        simulateSwipeLeft(cardItems.childNodes[index]);
      }

      const allCategoriesLink = queryByLabelText("all-categories-link");
      expect(allCategoriesLink).toBeNull();
    });
  });

  // it("calls the onSwipe function when a card is swiped", () => {
  //   const mockOnSwipe = jest.fn();
  //   const { getByRole } = render(<CardList />);
  //   const cardItem = getByRole("list");
  //   fireEvent.swipeStart(cardItem);
  //   fireEvent.swipeEnd(cardItem);
  //   expect(mockOnSwipe).toHaveBeenCalledWith("left");
  // });

  // it("calls the onCardLeftScreen function when a card leaves the screen", () => {
  //   const mockOnCardLeftScreen = jest.fn();
  //   const { getByTestId } = render(
  //     <CardList cards={mockCards} onCardLeftScreen={mockOnCardLeftScreen} />
  //   );
  //   const cardItem = getByTestId("card-item");
  //   fireEvent.swipeEnd(cardItem);
  //   expect(mockOnCardLeftScreen).toHaveBeenCalledWith("Card 1");
  // });
});
