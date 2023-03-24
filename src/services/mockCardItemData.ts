import { CardItemData } from "../components/Card";

export const cardItemData: CardItemData[] = [
  {
    link: "http://www.example.com/1",
    imgSrc: "https://picsum.photos/200",
    title: "Card 1",
    text: "This is card 1",
    categories: ["category0", "category1"],
    length: 100,
    points: 10,
    questionItems: [
      {
        question: "How long is a piece of string?",
        correctAnswer: "1",
        incorrectAnswers: ["2", "3", "4"],
      },
      {
        question: "True or false?",
        correctAnswer: "true",
        incorrectAnswers: ["false"],
      },
      {
        question: "O Romeo, Romeo, wherefore art thou Romeo?",
        correctAnswer: "Romeo",
      },
    ],
  },
  {
    link: "http://www.example.com/2",
    imgSrc: "https://picsum.photos/200",
    title: "Card 2",
    text: "This is card 2",
    categories: ["category1", "category 2", "category-3"],
    length: 80,
    points: 8,
    questionItems: [
      {
        question: "How long is a piece of string?",
        correctAnswer: "2",
        incorrectAnswers: ["1", "3", "4"],
      },
      {
        question: "True or false?",
        correctAnswer: "true",
        incorrectAnswers: ["false"],
      },
      {
        question: "O Romeo, Romeo, wherefore art thou Romeo?",
        correctAnswer: "Romeo",
      },
    ],
  },
  {
    link: "http://www.example.com/3",
    imgSrc: "https://picsum.photos/200",
    title: "Card 3",
    text: "This is card 3",
    categories: ["category1", "category 2", "category-3"],
    length: 130,
    points: 13,
    questionItems: [
      {
        question: "How long is a piece of string?",
        correctAnswer: "3",
        incorrectAnswers: ["1", "2", "4"],
      },
      {
        question: "True or false?",
        correctAnswer: "true",
        incorrectAnswers: ["false"],
      },
      {
        question: "O Romeo, Romeo, wherefore art thou Romeo?",
        correctAnswer: "Romeo",
      },
    ],
  },
];
