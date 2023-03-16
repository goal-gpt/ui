import "./QuizModal.scss";

import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

import { CardItemData } from "../Card";

export interface QuizModalProps {
  card: CardItemData | null;
  show: boolean;
  handleClose: () => void;
}

export const motivationalMessages = [
  "You got this!",
  "You're a rockstar!",
  "Let's go!",
  "Hooray!",
  "You're awesome!",
  "Let's do this!",
  "Great choice!",
  "Woohoo!",
];

export function QuizModal({ card, show, handleClose }: QuizModalProps) {
  const [message, setMessage] = useState(motivationalMessages[0]);

  useEffect(() => {
    setMessage(
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ]
    );
  }, [card]);

  return (
    <Modal onHide={handleClose} show={show} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{message}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <Quiz quiz={card} /> */}
        <h2>{card?.title}</h2>
        <h3>
          Click here to read your article:{" "}
          <a href={card?.link} target="_blank" rel="noreferrer">
            {card?.link}
          </a>
        </h3>
        <p>Hello! This is your quiz</p>
      </Modal.Body>
    </Modal>
  );
}
