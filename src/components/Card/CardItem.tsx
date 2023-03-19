import React from "react";
import { Card } from "react-bootstrap";
import TinderCard from "react-tinder-card";

// If there are no incorrect answers, it is a fill-in-the-blank question
// Otherwise, it is multiple-choice
export interface GameItem {
  question: string;
  correctAnswers: string[];
  incorrectAnswers?: string[];
}

export interface CardItemData {
  link: string;
  imgSrc: string;
  title: string;
  text: string;
  categories: string[];
  length: number;
  points: number;
  game: GameItem[];
}

export interface CardItemProps {
  data: CardItemData;
  handleSwipe: (direction: string) => void;
  handleLeftScreen: (direction: string) => void;
}

export function CardItem({
  data,
  handleSwipe,
  handleLeftScreen,
}: CardItemProps) {
  const { link, imgSrc, title, text } = data;

  return (
    <TinderCard
      className="swipe"
      onSwipe={handleSwipe}
      onCardLeftScreen={handleLeftScreen}
      swipeRequirementType="position"
    >
      <Card className="user-select-none card-item" role="listitem">
        <Card.Img className="card-img-top" src={imgSrc} draggable={false} />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{title}</Card.Title>
          <Card.Text>{text}</Card.Text>
          <Card.Footer className="mt-auto">
            <Card.Link
              href={link}
              target="_blank"
              rel="noreferrer"
              className="pressable"
            >
              {link}
            </Card.Link>
          </Card.Footer>
        </Card.Body>
      </Card>
    </TinderCard>
  );
}
