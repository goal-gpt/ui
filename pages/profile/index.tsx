import React, { useEffect, useState } from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";

import { CardItemData } from "../../src/components/Card";
import { MainHeader } from "../../src/components/MainHeader";
import { cardItemData } from "../../src/services/cardItemData";

interface CategoriesCounts {
  [key: string]: number;
}

// export interface ProfileProps {
//   cardItemData: CardItemData[];
// }

function Profile() {
  // const { cardItemData } = props;
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
        <Row className="mb-3">
          <Col className="d-flex align-items-center justify-content-center">
            <h1 className="text-center">Your Progress</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={2} md={1} sm={0} />
          <Col>
            {(hasMetrics && (
              <ListGroup>
                <ListGroup.Item>
                  # of quizzes completed: {completedCards.length}
                </ListGroup.Item>
                <ListGroup.Item>
                  # of categories covered:{" "}
                  {Object.keys(categoriesCounts).length}
                </ListGroup.Item>
                <ListGroup.Item>
                  # of quizzes per covered category:
                  {Object.keys(categoriesCounts).map((category) => (
                    <li key={category}>
                      {category}: {categoriesCounts[category]}
                    </li>
                  ))}
                </ListGroup.Item>
                <ListGroup.Item>
                  Amount of tested content:{" over "}
                  {Math.round(wordCount / 100) * 100} words
                </ListGroup.Item>
              </ListGroup>
            )) || (
              <p className="text-center">
                Once you&apos;ve completed some quizzes, come back here to track
                your progress!
              </p>
            )}
          </Col>
          <Col lg={2} md={1} sm={0} />
        </Row>
      </Container>
    </>
  );
}

export default Profile;
