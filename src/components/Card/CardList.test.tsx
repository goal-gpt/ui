import { render } from "@testing-library/react";
import React from "react";

import { CardList } from "./CardList";

describe("CardList component", () => {
  // const mockCards = [
  //   { index: 0, title: "Card 1", description: "This is card 1", src: "src1" },
  //   { index: 1, title: "Card 2", description: "This is card 2", src: "src2" },
  //   { index: 2, title: "Card 3", description: "This is card 3", src: "src3" },
  // ];

  it("renders a list of cards", () => {
    const { getByRole } = render(<CardList />);
    const cardItems = getByRole("list");
    // TODO: this is flaky because it depends on how nested we put the CardItem components
    expect(cardItems.childNodes.length).toBe(3);
  });

  // it("calls the onSwipe function when a card is swiped", () => {
  //   const mockOnSwipe = jest.fn();
  //   const { getByTestId } = render(
  //     <CardList cards={mockCards} onSwipe={mockOnSwipe} />
  //   );
  //   const cardItem = getByTestId("card-item");
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
