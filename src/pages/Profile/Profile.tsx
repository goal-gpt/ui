import "./Profile.scss";

import React, { useEffect, useState } from "react";
import { Container, ListGroup } from "react-bootstrap";

import { CardItemData } from "../../components/Card";
import { MainHeader } from "../../components/MainHeader";
import { cardItemData } from "../../services/cardItemData";

function Profile() {
  const [completedCards, setCompletedCards] = useState<CardItemData[]>([]);
  const [hasMetrics, setHasMetrics] = useState<boolean>(false);

  useEffect(() => {
    const completedCardLinks: string[] = JSON.parse(
      localStorage.getItem("eras.completedCardLinks") || "[]"
    );
    setCompletedCards(
      cardItemData.filter((card) => {
        return completedCardLinks.includes(card.link);
      })
    );
  }, []);

  useEffect(() => {
    if (completedCards.length) setHasMetrics(true);
  }, [completedCards]);

  return (
    <>
      <MainHeader />
      <Container>
        {(hasMetrics && (
          <ListGroup>
            <ListGroup.Item>
              Completed quizzes: {completedCards.length}
            </ListGroup.Item>
          </ListGroup>
        )) || (
          <p>
            Once you&apos;ve completed some quizzes, come back here to track
            your progress!
          </p>
        )}
      </Container>
    </>
  );
}

export default Profile;
