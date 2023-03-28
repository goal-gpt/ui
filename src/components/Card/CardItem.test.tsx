// fireEvent
import { render } from "@testing-library/react";
import React from "react";

import { cardItemData } from "../../services/mockCardItemData";
import { CardItem } from "./CardItem";
import { API } from "./CardList";

describe("CardItem", () => {
  const apiRef = React.createRef<API>();
  const handleSwipe = jest.fn();
  const handleLeftScreen = jest.fn();

  const data = cardItemData[0];

  const props = {
    data,
    apiRef,
    handleSwipe,
    handleLeftScreen,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByRole } = render(<CardItem {...props} />);
    expect(getByRole("listitem")).toBeInTheDocument();
  });

  // it("calls handleSwipe when swiped left", () => {
  //   const { getByRole } = render(<CardItem {...props} />);
  //   const card = getByRole("listitem");

  //   fireEvent.touchStart(card);
  //   fireEvent.touchMove(card, { touches: [{ clientX: -100 }] });
  //   fireEvent.touchEnd(card);

  //   expect(handleSwipe).toHaveBeenCalledWith("left");
  // });

  // it("calls handleSwipe when swiped right", () => {
  //   const { getByRole } = render(<CardItem {...props} />);
  //   const card = getByRole("listitem");

  //   fireEvent.touchStart(card);
  //   fireEvent.touchMove(card, { touches: [{ clientX: 100 }] });
  //   fireEvent.touchEnd(card);

  //   expect(handleSwipe).toHaveBeenCalledWith("right");
  // });

  // it("calls handleLeftScreen when card has left the screen", () => {
  //   const { getByRole } = render(<CardItem {...props} />);
  //   const card = getByRole("listitem");

  //   fireEvent.touchStart(card);
  //   fireEvent.touchMove(card, { touches: [{ clientX: -500 }] });
  //   fireEvent.touchEnd(card);

  //   expect(handleLeftScreen).toHaveBeenCalledWith(0, "left");
  // });
});
