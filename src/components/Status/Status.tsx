import React, { useContext, useEffect, useState } from "react";
import { Carousel, Col, Row, Spinner } from "react-bootstrap";

import { QueryStatus } from "../../hooks/useChat";
import { ChatContext } from "../Chat";

export function Status() {
  const chatContext = useContext(ChatContext);
  const { chatStatus } = chatContext || {
    chatStatus: QueryStatus.Loading,
  };
  const items = [
    "Visit your local library and borrow books for free.",
    "Check if your library has an online catalog and reserve books ahead of time to save time.",
    "Join a book club at your library to meet new people and discover new books.",
    "By borrowing books from the library, you can save money and reduce waste by not buying new books.",
  ]; // Array of strings to display
  // const [currentItemIndex, setCurrentItemIndex] = useState(0); // Index of the currently displayed item

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentItemIndex((prevIndex) => (prevIndex + 1) % items.length);
  //   }, 2000);

  //   // Initial delay for the first item
  //   const initialDelay = setTimeout(() => {
  //     setCurrentItemIndex(0); // Set the currentItemIndex to 1 after 1 second
  //   }, 5000);

  //   // Clean up the interval on component unmount
  //   return () => {
  //     clearInterval(interval);
  //     clearTimeout(initialDelay);
  //   }
  // }, [items.length]);

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
    <Row
      className="justify-content-center my-3"
      style={{ overflowX: "hidden" }}
    >
      <Col className="text-center">
        <Spinner animation="grow" size="sm" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
      <Carousel controls={false} indicators={false} interval={4000} fade>
        {items.map((item, index) => (
          <Carousel.Item
            key={index}
            style={{ transitionDuration: '1.5s', transitionTimingFunction: '10s ease-out' }}
          >
            <p>{item}</p>
          </Carousel.Item>
        ))}
      </Carousel>
    </Row>
  );
}
