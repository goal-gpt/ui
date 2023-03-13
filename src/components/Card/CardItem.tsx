import React from "react";
import { Card } from "react-bootstrap";
import TinderCard from "react-tinder-card";

export interface CardItemData {
  index: number;
  link: string;
  imgSrc: string;
  title: string;
  text: string;
  categories: string[];
  length: number;
  points: number;
}

export interface CardItemProps {
  data: CardItemData;
  // ref: RefObject<string>;
  handleSwipe: (direction: string) => void;
  handleLeftScreen: (direction: string) => void;
}

export function CardItem({
  data,
  // ref,
  handleSwipe,
  handleLeftScreen,
}: CardItemProps) {
  const { index, link, imgSrc, title, text } = data;

  return (
    <TinderCard
      // ref={ref}
      className="swipe"
      key={index}
      onSwipe={handleSwipe}
      onCardLeftScreen={handleLeftScreen}
      swipeRequirementType="position"
    >
      <Card role="listitem" className="card-item user-select-none">
        <Card.Img variant="top" src={imgSrc} draggable={false} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{text}</Card.Text>
          <Card.Link href={link} target="_blank">
            {link}
          </Card.Link>
        </Card.Body>
      </Card>
    </TinderCard>
  );
}
