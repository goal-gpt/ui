import type { ReactNode } from "react";
import React, { useContext, useEffect, useState } from "react";
import { Carousel, Col, Row, Spinner } from "react-bootstrap";

import { QueryStatus } from "../../hooks/useChat";
import { loadingItemData } from "../../services/loadingItemData";
import { ChatContext } from "../Chat";
import { LoadingItemType } from "./LoadingItem";

export function Status() {
  const chatContext = useContext(ChatContext);
  const { chatStatus } = chatContext || {
    chatStatus: QueryStatus.Loading,
  };
  const [randomizedItems, setRandomizedItems] = useState(loadingItemData);

  useEffect(() => {
    const shuffledItems = [...loadingItemData].sort(() => Math.random() - 0.5);

    setRandomizedItems(shuffledItems);
  }, [loadingItemData]);

  const getLoadingText = (
    index: number,
    type: LoadingItemType,
    text: string,
  ): ReactNode => {
    // Delay initially showing anything
    if (index === 0) return "";
    if (index % 4 === 0) return "Working on your personalized action plan...";
    if (type === LoadingItemType.Fact) return `Did you know: ${text}`;

    // Return italicized text when the LoadingItemType is Quote
    if (type === LoadingItemType.Quote) return <i>{`"${text}"`}</i>;

    return `"${text}"`;
  };

  if (chatStatus === QueryStatus.Success || chatStatus === QueryStatus.Idle) {
    return null;
  }

  if (chatStatus === QueryStatus.Error) {
    return (
      <Row className="justify-content-center">
        <Col className="text-center">
          <p className="text-danger">
            Sorry, an error occurred. Please try again!
          </p>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <Row
        className="justify-content-center my-3"
        style={{ overflowX: "hidden" }}
      >
        <Col className="text-center">
          <Spinner animation="grow" size="sm" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Col>
      </Row>
      <Row
        className="justify-content-center my-4"
        style={{ overflowX: "hidden" }}
      >
        <Col className="text-center">
          <Carousel controls={false} indicators={false} interval={4000} fade>
            {randomizedItems.map((item, index) => (
              <Carousel.Item key={index} style={{ transitionDuration: "1s" }}>
                <p className="text-center">
                  {getLoadingText(index, item.type, item.text)}
                </p>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </>
  );
}
