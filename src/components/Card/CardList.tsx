import "./Card.scss";

import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { CardItem, CardItemData } from "./CardItem";

export interface CardListProps {
  cardItemData: CardItemData[];
  selectCard: (card: CardItemData) => void;
  removeCard: (card: CardItemData) => void;
}

export function CardList({
  cardItemData,
  selectCard,
  removeCard,
}: CardListProps) {
  const { category } = useParams();
  const [cards, setCards] = useState<CardItemData[]>([]);

  // If no category is supplied, use all cards.
  // Otherwise, use cards with a matching category
  useEffect(() => {
    const newCards =
      category === undefined
        ? cardItemData
        : cardItemData.filter((item) => {
            // Ensure that "record-keeping" will match "record-keeping"
            // And that "financial-planning" will match "financial planning"
            const categoryWithoutHyphens = category.replaceAll("-", " ");
            const categoriesWithoutHyphens = item.categories.map((c) =>
              c.replaceAll("-", " ")
            );

            return categoriesWithoutHyphens.includes(categoryWithoutHyphens);
          });

    // Throw error if there are no matching cards
    // TODO: instead of throwing an error we might want to redirect to a `categories` page
    if (newCards.length === 0)
      throw new Error(
        "Sorry, we do not have any content in that category. But please check back later. We are constantly adding new content!"
      );
    setCards(newCards);
  }, []);

  const swiped = (direction: string, card: CardItemData) => {
    if (direction === "left" || direction === "down") {
      removeCard(card);
    } else {
      selectCard(card);
    }
  };

  return (
    <Container fluid>
      <Row className="d-grid justify-content-center" role="list">
        {cards.map((card) => (
          <CardItem
            key={card.link}
            data={card}
            handleSwipe={(dir) => swiped(dir, card)}
            handleLeftScreen={() => ""}
          />
        ))}
      </Row>
      <Row className="mt-3 justify-content-between">
        <Col />
        <Col className="d-flex align-items-center justify-content-center">
          {"<"} Swipe left to skip!
        </Col>
        <Col className="d-flex align-items-center justify-content-center">
          Swipe right to take a quiz! {">"}
        </Col>
        <Col />
      </Row>
    </Container>
  );
}
