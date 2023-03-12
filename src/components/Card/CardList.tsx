import "./Card.scss";

import React, { useState } from "react";
import { Container } from "react-bootstrap";

import { mockCards } from "../../services/mockCardData";
import { logger } from "../../utils/logger";
import { CardItem } from "./CardItem";

export interface CardListProps {
  category: string;
}

export function CardList({ category }: CardListProps) {
  const [lastDirection, setLastDirection] = useState("");

  // If no category is supplied, use all cards.
  // Otherwise, use cards with a matching category
  const cards =
    category === ""
      ? mockCards
      : mockCards.filter((mockCard) => mockCard.categories.includes(category));

  // Throw error if there are no matching cards
  if (cards.length === 0)
    throw new Error(
      "Sorry, we do not have any content in that category. But please check back later. We are constantly adding new content!"
    );

  const swiped = (direction: string, nameToDelete: string) => {
    logger.info(`removing: ${nameToDelete}`);
    setLastDirection(direction);
  };

  const outOfFrame = (title: string) => {
    logger.info(`${title} left the screen!`);
  };

  return (
    <Container
      className="card-container d-flex flex-column align-items-center justify-content-center"
      role="list"
    >
      {cards.map((card) => (
        <CardItem
          key={card.index}
          data={card}
          handleSwipe={(dir) => swiped(dir, card.title)}
          handleLeftScreen={() => outOfFrame(card.title)}
        />
      ))}
      {lastDirection ? (
        <h2 className="infoText">You swiped {lastDirection}</h2>
      ) : (
        ""
      )}
    </Container>
  );
}
