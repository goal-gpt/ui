import "./Card.scss";

import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { logger } from "../../utils/logger";
import { CardItem, CardItemData } from "./CardItem";

export interface CardListProps {
  cardItemData: CardItemData[];
}

export function CardList({ cardItemData }: CardListProps) {
  const [lastDirection, setLastDirection] = useState("");
  const { category } = useParams();

  // If no category is supplied, use all cards.
  // Otherwise, use cards with a matching category
  const cards =
    category === undefined
      ? cardItemData
      : cardItemData.filter((item) => {
          // Ensure that "record-keeping" will match "record-keeping"
          // And that "financial-planning" will match "financial planning"
          const categoryWithoutHyphens = category.replace("-", " ");
          const categoriesWithoutHyphens = item.categories.map((c) =>
            c.replace("-", " ")
          );

          return categoriesWithoutHyphens.includes(categoryWithoutHyphens);
        });

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
          key={card.link}
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
