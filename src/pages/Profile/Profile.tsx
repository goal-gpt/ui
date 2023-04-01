import "./Profile.scss";

import React, { useEffect, useState } from "react";
import { Container, ListGroup } from "react-bootstrap";

import { CardItemData } from "../../components/Card";
import { MainHeader } from "../../components/MainHeader";
import { cardItemData } from "../../services/cardItemData";

export interface CategoriesMetrics {
  [key: string]: number;
}

function Profile() {
  const [completedCards, setCompletedCards] = useState<CardItemData[]>([]);
  const [hasMetrics, setHasMetrics] = useState<boolean>(false);
  const [categoriesMetrics, setCategoriesMetrics] = useState<CategoriesMetrics>(
    {}
  );

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

    // Store # of quizzes per category
    const categoriesMetricsTemp: CategoriesMetrics = {};
    completedCards.forEach((card) => {
      card.categories.forEach((category) => {
        categoriesMetricsTemp[category] =
          category in categoriesMetricsTemp
            ? (categoriesMetricsTemp[category] += 1)
            : 1;
      });
    });

    setCategoriesMetrics(categoriesMetricsTemp);
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
                # of categories covered: {Object.keys(categoriesMetrics).length}
              </ListGroup.Item>
              <ListGroup.Item>
                # of quizzes per covered category:
                {Object.keys(categoriesMetrics).map((category) => (
                  <li key={category}>
                    {category}: {categoriesMetrics[category as keyof object]}
                  </li>
                ))}
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
