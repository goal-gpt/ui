import "./Card.scss";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { Button } from "../Button";
import { CardItem, CardItemData } from "./CardItem";

// The API interface in react-tinder-card wasn't exported, so it's copied here
export interface API {
  swipe(dir?: string): Promise<void>;
  restoreCard(): Promise<void>;
}

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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentIndexRef = useRef(currentIndex);

  // Remove cards whose links are stored in localstorage
  const filterByCompletion = (
    unfilteredCards: CardItemData[]
  ): CardItemData[] => {
    const completedContentLinks: string[] = JSON.parse(
      localStorage.getItem("eras.completedCardLinks") || "[]"
    );

    return unfilteredCards.filter((item) => {
      return (
        !completedContentLinks.includes(item.link) &&
        item.questionItems.length !== 0
      );
    });
  };

  // If no category is supplied, use all cards.
  // Otherwise, use cards with a matching category
  const filterByCategory = (
    unfilteredCards: CardItemData[]
  ): CardItemData[] => {
    return category === undefined
      ? unfilteredCards
      : unfilteredCards.filter((item) => {
          // Ensure that "record-keeping" will match "record-keeping"
          // And that "financial-planning" will match "financial planning"
          const categoryWithoutHyphens = category.replaceAll("-", " ");
          const categoriesWithoutHyphens = item.categories.map((c) =>
            c.replaceAll("-", " ")
          );

          return categoriesWithoutHyphens.includes(categoryWithoutHyphens);
        });
  };

  const childRefs = useMemo(() => {
    return cards.map(() => React.createRef<API>());
  }, [cards]);

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  // Decrease current index and handle card selection/removal
  const swiped = (direction: string, index: number) => {
    updateCurrentIndex(index - 1);
    if (direction === "left" || direction === "down") {
      removeCard(cards[index]);
    } else {
      selectCard(cards[index]);
    }
  };

  const swipe = async (dir: string) => {
    if (currentIndex >= 0 && currentIndex < cards.length) {
      const cardRef = childRefs[currentIndex].current;
      if (cardRef) {
        await cardRef.swipe(dir); // Swipe the card!
      }
    }
  };

  // TODO: figure out how to reset cards
  // const canGoBack = currentIndex < cards.length - 1;

  // increase current index and show card
  // const goBack = async () => {
  //   if (!canGoBack) return;
  //   const newIndex = currentIndex + 1;
  //   updateCurrentIndex(newIndex);
  //   const cardRef = childRefs[currentIndex].current;
  //   if (cardRef) {
  //     await cardRef.restoreCard();
  //   }
  // };

  useEffect(() => {
    const cardsToComplete = filterByCompletion(cardItemData);
    const cardsToShow = filterByCategory(cardsToComplete);

    // Throw error if there are no matching cards
    // TODO: instead of throwing an error we might want to redirect to a `categories` page
    if (cardsToShow.length === 0)
      throw new Error(
        "Sorry, we do not have any content in that category. But please check back later. We are constantly adding new content!"
      );
    setCards(cardsToShow.sort(() => Math.random() - 0.5));
    setCurrentIndex(cardsToShow.length - 1);
  }, []);

  return (
    <Container fluid>
      <Row className="d-grid justify-content-center" role="list">
        {cards.map((card, index) => (
          <CardItem
            apiRef={childRefs[index]}
            key={card.link}
            data={card}
            handleSwipe={(dir: string) => swiped(dir, index)}
            handleLeftScreen={() => ""}
          />
        ))}
      </Row>
      <Row className="mt-3 justify-content-between">
        <Col md={3} xs={1} />
        <Col className="d-flex align-items-center justify-content-center">
          <Button onClick={() => swipe("left")}>{"<"} Left to skip!</Button>
        </Col>
        {/* <Col>
          <Button onClick={() => goBack()}>Undo swipe!</Button>
        </Col> */}
        <Col className="d-flex align-items-center justify-content-center">
          <Button onClick={() => swipe("right")} variant="secondary">
            Right for a quiz! {">"}
          </Button>
        </Col>
        <Col md={3} xs={1} />
      </Row>
    </Container>
  );
}
