import "./QuizModal.scss";

import React from "react";
import Modal from "react-bootstrap/Modal";

import { logger } from "../../utils/logger";
import { CardItemData } from "../Card";

export interface QuizModalProps {
  card: CardItemData | null;
  show: boolean;
  handleClose: () => void;
}

export function QuizModal({ card, show, handleClose }: QuizModalProps) {
  logger.debug(card); // Just to avoid errors for now
  const motivationalMessages = [
    "You got this!",
    "You're a rockstar!",
    "Let's go!",
    "Hooray!",
    "You're awesome!",
    "Let's do this!",
    "Great choice!",
    "Woohoo!",
  ];

  return (
    <Modal onHide={handleClose} show={show} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          {
            motivationalMessages[
              Math.floor(Math.random() * motivationalMessages.length)
            ]
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <Quiz quiz={card} /> */}
        <p>Hello! This is your quiz</p>
      </Modal.Body>
    </Modal>
  );
}
