import React, { useState } from "react";
import { Card } from "react-bootstrap";
import TinderCard from "react-tinder-card";

import { API } from "./CardList";

// If there are no incorrect answers, it is multiple-choice
// Otherwise, it is fill-in-the-blank with a single blank
export interface QuestionItem {
  question: string;
  correctAnswer: string;
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
  questionItems: QuestionItem[];
  testedContent?: string;
}

export interface CardItemProps {
  data: CardItemData;
  apiRef: React.RefObject<API>;
  handleSwipe: (direction: string) => void;
}

export function CardItem({ data, apiRef, handleSwipe }: CardItemProps) {
  const { link, imgSrc, title, text } = data;
  const [isHidden, setIsHidden] = useState(false);

  const getTruncatedTitle = (): string => {
    const truncatableLength = title.length;
    const truncatedTitle =
      window.innerWidth >= 768
        ? title.substring(0, 110)
        : title.substring(0, 50);

    return truncatedTitle.length < truncatableLength
      ? `${truncatedTitle} ...`
      : truncatedTitle;
  };

  const getTruncatedText = (): string => {
    const truncatableLength = text.length;
    const truncatedText =
      window.innerWidth >= 768 ? text.substring(0, 400) : text.substring(0, 90);

    return truncatedText.length < truncatableLength
      ? `${truncatedText} ...`
      : truncatedText;
  };

  const getTruncatedSource = (): string => {
    const trunctableURL = new URL(link);
    const indexOfLastPeriod = trunctableURL.host.lastIndexOf(".");
    const hostWithoutTLD = trunctableURL.host.substring(0, indexOfLastPeriod);
    const indexOfSecondToLastPeriod = hostWithoutTLD.lastIndexOf(".");
    const source =
      indexOfSecondToLastPeriod > 0
        ? hostWithoutTLD.substring(indexOfSecondToLastPeriod + 1)
        : hostWithoutTLD;
    const sourceLength = source.length;
    const truncatedSource =
      window.innerWidth >= 768
        ? source.substring(0, 50)
        : source.substring(0, 25);

    return truncatedSource.length < sourceLength
      ? `${truncatedSource} ...`
      : truncatedSource;
  };

  return (
    <TinderCard
      ref={apiRef}
      className={`swipe ${isHidden ? "hidden" : ""}`}
      onSwipe={handleSwipe}
      onCardLeftScreen={() => setIsHidden(true)}
      swipeRequirementType="position"
    >
      <Card className="user-select-none card-item" role="listitem">
        <Card.Img
          className="card-img-top eras-card-img-btm"
          src={imgSrc}
          draggable={false}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="text-neutral-dark">
            {getTruncatedTitle()}
          </Card.Title>
          <Card.Text className="text-neutral-light">
            {getTruncatedText()}
          </Card.Text>
          <Card.Footer className="mt-auto">
            <Card.Link
              href={link}
              target="_blank"
              rel="noreferrer"
              className="pressable"
            >
              {getTruncatedSource()}
            </Card.Link>
          </Card.Footer>
        </Card.Body>
      </Card>
    </TinderCard>
  );
}
