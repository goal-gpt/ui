import "./Profile.scss";

import React, { useEffect, useState } from "react";
import { Container, ListGroup } from "react-bootstrap";

import { CardItemData } from "../../components/Card";
import { MainHeader } from "../../components/MainHeader";
import { cardItemData } from "../../services/cardItemData";

function Profile() {
  const [completedCards, setCompletedCards] = useState<CardItemData[]>([]);
  const [hasMetrics, setHasMetrics] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);

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

    const categoriesArrays = completedCards.map((card) => card.categories);

    // Set array of unique content categories
    setCategories(
      Array.from(new Set(categoriesArrays.flatMap((category) => category)))
    );
  }, [completedCards]);

  return (
    <>
      <MainHeader />
      <Container>
        {(hasMetrics && (
          <>
            <h2>Your Metrics</h2>
            <ListGroup>
              <ListGroup.Item>
                # of quizzes completed: {completedCards.length}
              </ListGroup.Item>
              <ListGroup.Item>
                # of categories covered: {categories.join(", ")}
              </ListGroup.Item>
            </ListGroup>
          </>
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
