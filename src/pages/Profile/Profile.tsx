import "./Profile.scss";

import React, { useEffect, useState } from "react";
import { Container, ListGroup } from "react-bootstrap";

import { CardItemData } from "../../components/Card";
import { MainHeader } from "../../components/MainHeader";

interface CategoriesCounts {
  [key: string]: number;
}

export interface ProfileProps {
  cardItemData: CardItemData[];
}

function Profile(props: ProfileProps) {
  const { cardItemData } = props;
  const [completedCards, setCompletedCards] = useState<CardItemData[]>([]);
  const [hasMetrics, setHasMetrics] = useState<boolean>(false);
  const [categoriesCounts, setCategoriesCounts] = useState<CategoriesCounts>(
    {}
  );
  const [wordCount, setWordCount] = useState<number>(0);

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
    const categoriesMetricsTemp: CategoriesCounts = {};
    completedCards.forEach((card) => {
      card.categories.forEach((category) => {
        categoriesMetricsTemp[category] =
          category in categoriesMetricsTemp
            ? (categoriesMetricsTemp[category] += 1)
            : 1;
      });
    });

    setCategoriesCounts(categoriesMetricsTemp);

    // Count spaces in total testedContent
    const totalSpaces = completedCards.reduce(
      (accumulator, currentValue) =>
        accumulator + (currentValue.testedContent?.match(/ /g)?.length || 0),
      0
    );
    setWordCount(totalSpaces);
  }, [completedCards]);

  return (
    <>
      <MainHeader />
      <Container>
        <h2>Your Progress</h2>
        {(hasMetrics && (
          <ListGroup>
            <ListGroup.Item>
              # of quizzes completed: {completedCards.length}
            </ListGroup.Item>
            <ListGroup.Item>
              # of categories covered: {Object.keys(categoriesCounts).length}
            </ListGroup.Item>
            <ListGroup.Item>
              # of quizzes per covered category:
              {Object.keys(categoriesCounts).map((category) => (
                <li key={category}>
                  {category}: {categoriesCounts[category as keyof object]}
                </li>
              ))}
            </ListGroup.Item>
            <ListGroup.Item>
              Amount of tested content:{" over "}
              {Math.round(wordCount / 100) * 100} words
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
