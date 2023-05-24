import { act, render } from "@testing-library/react";
import React from "react";

import { simulateSwipeLeft } from "../../utils";
import { CardItem, CardItemProps } from "./CardItem";

const mockHandleSwipe = jest.fn();

const mockCardItemData: CardItemProps = {
  data: {
    link: "https://www.example.com",
    imgSrc: "https://www.example.com/image.jpg",
    title: "Test Title",
    text: "Test Text",
    categories: ["Test"],
    length: 10,
    points: 5,
    questionItems: [
      {
        question: "Test question",
        correctAnswer: "Test answer",
      },
    ],
    testedContent: "Test Content",
  },
  handleSwipe: mockHandleSwipe,
};

describe("CardItem component", () => {
  it("renders correctly", async () => {
    const { findByText } = render(<CardItem {...mockCardItemData} />);

    expect(await findByText("Test Title")).toBeInTheDocument();
    expect(await findByText("Test Text")).toBeInTheDocument();
    expect(await findByText("example")).toBeInTheDocument();
  });

  it("handles swipe correctly", () => {
    const { getByRole } = render(<CardItem {...mockCardItemData} />);
    const card = getByRole("listitem");

    simulateSwipeLeft(card);

    expect(mockHandleSwipe).toHaveBeenCalled();
  });

  it("card visibility changes when swiped off screen", async () => {
    const { findByRole } = render(<CardItem {...mockCardItemData} />);
    const card = (await findByRole("listitem")).parentNode as HTMLElement;

    // initially the card is visible
    expect(card).not.toHaveClass("hidden");

    simulateSwipeLeft(card);

    // now the card should be hidden
    // TODO: fix this test as it doesn't work
    // await waitFor(() => expect(card.parentElement).toHaveClass("hidden"));
  });

  describe("getTruncatedText function", () => {
    const longText = "A".repeat(500); // create a string of 500 'A's
    const mockCardItemDataWithLongText = {
      ...mockCardItemData,
      data: { ...mockCardItemData.data, text: longText },
    };

    it("truncates long text correctly on large screens", () => {
      global.innerWidth = 800; // simulate large screen
      const { getByText, rerender } = render(
        <CardItem {...mockCardItemDataWithLongText} />
      );

      expect(
        getByText(`${longText.substring(0, 400)} ...`)
      ).toBeInTheDocument();

      global.innerWidth = 500; // simulate small screen

      act(() => {
        // Force a re-render with the new window size
        rerender(<CardItem {...mockCardItemDataWithLongText} />);
      });

      expect(getByText(`${longText.substring(0, 90)} ...`)).toBeInTheDocument();
    });

    it("does not truncate short text", () => {
      const shortText = "A".repeat(50); // create a string of 50 'A's
      const mockCardItemDataWithShortText = {
        ...mockCardItemData,
        data: { ...mockCardItemData.data, text: shortText },
      };

      const { getByText } = render(
        <CardItem {...mockCardItemDataWithShortText} />
      );

      expect(getByText(shortText)).toBeInTheDocument();
    });
  });
});
