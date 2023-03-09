import "./Card.scss";

import React, { useState } from "react";
import { Container } from "react-bootstrap";

import { mockCards } from "../../services/mockCardData";
import { logger } from "../../utils/logger";
import { CardItem } from "./CardItem";

export function CardList() {
  const [lastDirection, setLastDirection] = useState("");
  const cards = mockCards;

  const swiped = (direction: string, nameToDelete: string) => {
    logger.info(`removing: ${nameToDelete}`);
    setLastDirection(direction);
  };

  const outOfFrame = (title: string) => {
    logger.info(`${title} left the screen!`);
  };

  // useEffect(() => {

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
