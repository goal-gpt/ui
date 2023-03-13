import { render } from "@testing-library/react";
import React from "react";
import * as ReactRouterDOM from "react-router-dom";

import { CardList } from "./CardList";
import { mockCards } from "../../services/mockCardData";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("CardList component", () => {
  // const mockCards = [
  //   { index: 0, title: "Card 1", description: "This is card 1", src: "src1" },
  //   { index: 1, title: "Card 2", description: "This is card 2", src: "src2" },
  //   { index: 2, title: "Card 3", description: "This is card 3", src: "src3" },
  // ];

  it("renders a list of all cards if no category is supplied", () => {
    const params = {};
    jest.spyOn(ReactRouterDOM, "useParams").mockReturnValue(params);

    const { getByRole } = render(<CardList cardItemData={mockCards}/>);
    const cardItems = getByRole("list");
    // TODO: this is flaky because it depends on how nested we put the CardItem components
    expect(cardItems.childNodes.length).toBe(3);
  });

  it("renders a list of cards with the matching category", () => {
    const params = { category: "category2" };
    jest.spyOn(ReactRouterDOM, "useParams").mockReturnValue(params);

    const { getByRole } = render(<CardList cardItemData={mockCards}/>);
    const cardItems = getByRole("list");
    expect(cardItems.childNodes.length).toBe(2);
  });

  it("renders an error page when there is no matching category", () => {
    const params = { category: "not-a-matching-category" };
    jest.spyOn(ReactRouterDOM, "useParams").mockReturnValue(params);

    expect(() => render(<CardList cardItemData={mockCards}/>)).toThrow(
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
