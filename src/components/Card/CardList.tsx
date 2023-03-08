import "./Card.scss";

import React, { useState } from "react";
import { Container } from "react-bootstrap";

import { CardItem, CardItemData } from "./CardItem";

const cards: CardItemData[] = [
  {
    index: 0,
    src: "https://picsum.photos/200",
    title: "Card 1",
    text: "This is card 1",
  },
  {
    index: 1,
    src: "https://picsum.photos/200",
    title: "Card 2",
    text: "This is card 2",
  },
  {
    index: 2,
    src: "https://picsum.photos/200",
    title: "Card 3",
    text: "This is card 3",
  },
];

export function CardList() {
  const [lastDirection, setLastDirection] = useState("");

  const swiped = (direction: string, nameToDelete: string) => {
    console.log(`removing: ${nameToDelete}`);
    setLastDirection(direction);
  };

  const outOfFrame = (title: string) => {
    console.log(`${title} left the screen!`);
  };

  return (
    <Container
      className="card-container d-flex flex-column align-items-center justify-content-center"
      role="list"
    >
      {cards.map((card) => (
        <CardItem
          // ref={childRefs[card.index]}
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
