import { CardItemData } from "../components/Card";

export const mockCards: CardItemData[] = [
  {
    index: 0,
    imgSrc: "https://picsum.photos/200",
    title: "Card 1",
    text: "This is card 1",
    categories: ["category0", "category1"],
    length: 100,
    points: 10,
  },
  {
    index: 1,
    imgSrc: "https://picsum.photos/200",
    title: "Card 2",
    text: "This is card 2",
    categories: ["category1", "category2", "category3"],
    length: 80,
    points: 8,
  },
  {
    index: 2,
    imgSrc: "https://picsum.photos/200",
    title: "Card 3",
    text: "This is card 3",
    categories: ["category1", "category2", "category3"],
    length: 130,
    points: 13,
  },
];
