import { render } from "@testing-library/react";
import React from "react";
import * as ReactRouterDOM from "react-router-dom";

import { cardItemData } from "../../services/mockCardItemData";
import { CardList, CardListProps } from "./CardList";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("CardList component", () => {
  let mockSelectCard: jest.Mock;
  let mockRemoveCard: jest.Mock;
  let mockCardListProps: CardListProps;

  beforeEach(() => {
    mockSelectCard = jest.fn();
    mockRemoveCard = jest.fn();
    mockCardListProps = {
      cardItemData: cardItemData,
      selectCard: mockSelectCard,
      removeCard: mockRemoveCard,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a list of all cards if no category is supplied", () => {
    const params = {};
    jest.spyOn(ReactRouterDOM, "useParams").mockReturnValue(params);

    const { getByRole } = render(<CardList {...mockCardListProps} />);
    const cardItems = getByRole("list");
    // TODO: this is flaky because it depends on how nested we put the CardItem components
    expect(cardItems.childNodes.length).toBe(3);
  });

  it("renders a list of cards with the matching category", () => {
    const params = { category: "category0" };
    jest.spyOn(ReactRouterDOM, "useParams").mockReturnValue(params);

    const { getByRole } = render(<CardList {...mockCardListProps} />);
    const cardItems = getByRole("list");
    expect(cardItems.childNodes.length).toBe(1);
  });

  it("renders a list of cards with the matching category hyphen-insensitive", () => {
    const params = { category: "category-3" };
    jest.spyOn(ReactRouterDOM, "useParams").mockReturnValue(params);

    const { getByRole } = render(<CardList {...mockCardListProps} />);
    const cardItems = getByRole("list");
    expect(cardItems.childNodes.length).toBe(2);
  });

  it("renders an error page when there is no matching category", () => {
    const params = { category: "not-a-matching-category" };
    jest.spyOn(ReactRouterDOM, "useParams").mockReturnValue(params);

    expect(() => render(<CardList {...mockCardListProps} />)).toThrow(
      "Sorry, we do not have any content in that category. But please check back later. We are constantly adding new content!"
    );
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
