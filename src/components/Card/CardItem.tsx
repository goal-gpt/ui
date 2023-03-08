import React from "react";
import { Card } from "react-bootstrap";
import TinderCard from "react-tinder-card";

export interface CardItemData {
  index: number;
  src: string;
  title: string;
  text: string;
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
  const { index, src, title, text } = data;

  return (
    <TinderCard
      // ref={ref}
      className="swipe pressable"
      key={index}
      onSwipe={handleSwipe}
      onCardLeftScreen={handleLeftScreen}
      swipeRequirementType="position"
    >
      <Card role="listitem" className="card-item">
        <Card.Img variant="top" src={src} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{text}</Card.Text>
        </Card.Body>
      </Card>
    </TinderCard>
  );
}
