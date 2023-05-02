import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { Button } from "../Button";
import { CardItemData } from "./CardItem";
import CardItem from "./CardItem";

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
  const router = useRouter();
  const { category } = router.query as { category: string };
  const [cards, setCards] = useState<CardItemData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentIndexRef = useRef(currentIndex);
  const [anySkipped, setAnySkipped] = useState<boolean>(false);
  const [areMoreCards, setAreMoreCards] = useState<boolean>(false);
  const getCompletedContentLinks = (): string[] => {
    return JSON.parse(localStorage.getItem("eras.completedCardLinks") || "[]");
  };

  // Remove cards whose links are stored in localstorage
  const filterByCompletion = (
    unfilteredCards: CardItemData[]
  ): CardItemData[] => {
    const completedContentLinks = getCompletedContentLinks();

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
      setAnySkipped(true);
    } else {
      selectCard(cards[index]);
    }
  };

  // const swipe = async (dir: string, index: number) => {
  // console.log(childRefs);
  // if (currentIndex >= 0 && currentIndex < cards.length) {
  //   const cardRef = childRefs[currentIndex].current;
  //   if (cardRef) {
  //     console.log(cardRef);
  //     await cardRef.swipe(dir); // Swipe the card!
  //   }
  // }
  // updateCurrentIndex(index - 1);
  // if (dir === "left" || dir === "down") {
  //   removeCard(cards[currentIndex]);
  //   setAnySkipped(true);
  // } else {
  //   selectCard(cards[currentIndex]);
  // }
  // };

  const setup = () => {
    const cardsToComplete = filterByCompletion(cardItemData);
    const cardsToShow = filterByCategory(cardsToComplete);

    setAreMoreCards(cardsToComplete.length > cardsToShow.length);

    // Throw error if there are no matching cards
    // TODO: instead of throwing an error we might want to redirect to a `categories` page
    if (cardsToShow.length === 0)
      throw new Error(
        "Sorry, we do not have any content in that category. But please check back later. We are constantly adding new content!"
      );
    setCards(cardsToShow.sort(() => Math.random() - 0.5));
    setCurrentIndex(cardsToShow.length - 1);
    setAnySkipped(false);
  };

  const areSkippedOrMissedCards = (): boolean => {
    if (anySkipped) return anySkipped;

    const linksToShow = cards.map((card) => card.link);
    const completedCardLinks = getCompletedContentLinks();

    return linksToShow.some((link) => !completedCardLinks.includes(link));
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
    setup();
  }, []);

  return (
    <Container fluid>
      {(currentIndex > -1 && (
        <>
          <Row className="d-grid justify-content-center" role="list">
            {cards.map((card, index) => (
              <CardItem
                ref={childRefs[index]}
                key={card.link}
                data={card}
                handleSwipe={(dir: string) => swiped(dir, index)}
              />
            ))}
          </Row>
          <Row className="mt-3 justify-content-between">
            <Col md={3} xs={1} />
            <Col className="d-flex align-items-center justify-content-center">
              <Button
                aria-label="left-button"
                disabled
                // onClick={() => swipe("left", currentIndex)}
              >
                {"<"} Left to skip!
              </Button>
            </Col>
            {/* <Col>
      <Button onClick={() => goBack()}>Undo swipe!</Button>
    </Col> */}
            <Col className="d-flex align-items-center justify-content-center">
              <Button
                // onClick={() => swipe("right", currentIndex)}
                variant="secondary"
                aria-label="right-button"
                disabled
              >
                Right for a quiz! {">"}
              </Button>
            </Col>
            <Col md={3} xs={1} />
          </Row>
        </>
      )) || (
        <Row>
          <Col md={3} xs={1} />
          <Col>
            <p>
              Looks like you&apos;ve reached the end. Please check back later.
              We add new content regularly!
            </p>
            {areSkippedOrMissedCards() && (
              <p>
                Click{" "}
                <Link
                  href="/"
                  aria-label="review-link"
                  onClick={(event) => {
                    event.preventDefault();
                    setup();
                  }}
                >
                  here
                </Link>{" "}
                to review what you skipped or missed.
              </p>
            )}
            {areMoreCards && (
              <p>
                Click{" "}
                <Link href="/" aria-label="all-categories-link">
                  here
                </Link>{" "}
                to learn something new.
              </p>
            )}
          </Col>
          <Col md={3} xs={1} />
        </Row>
      )}
    </Container>
  );
}
