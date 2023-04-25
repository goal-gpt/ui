import "./QuizModal.module.scss";

import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

import { CardItemData } from "../Card";
import { FeedbackForm } from "../Feedback";
import { QuizForm } from "./QuizForm";

export interface QuizModalProps {
  card: CardItemData | null;
  show: boolean;
  handleClose: (isCompleted: boolean) => void;
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
  const [showGrade, setShowGrade] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const getCardLinks = (): string[] => {
    return JSON.parse(localStorage.getItem("eras.completedCardLinks") || "[]");
  };

  const storeCardLinks = (cardLinks: string[]) => {
    localStorage.setItem("eras.completedCardLinks", JSON.stringify(cardLinks));
  };

  useEffect(() => {
    setMessage(
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ]
    );
  }, [card]);

  useEffect(() => {
    if (isCompleted && card) {
      const completedCardLinks = getCardLinks();

      completedCardLinks.push(card.link);
      storeCardLinks(completedCardLinks);
    }
  }, [isCompleted]);

  return (
    <Modal
      onHide={() => handleClose(false)}
      show={show}
      backdrop="static"
      keyboard={false}
      centered
      scrollable
      fullscreen="md-down"
    >
      <Modal.Header closeButton>
        <Modal.Title>{message}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 className="my-2">Click here to learn: </h4>
        <h2>
          <a
            className="external-link"
            href={card?.link}
            target="_blank"
            rel="noreferrer"
          >
            {card?.title}
          </a>
        </h2>
        <hr />
        <h3>Quiz</h3>
        <QuizForm
          setIsCompleted={setIsCompleted}
          setShowGrade={setShowGrade}
          card={card}
        />
        <Alert
          variant={isCompleted ? "success" : "warning"}
          onClose={() => {
            setShowGrade(false);
            handleClose(isCompleted);
          }}
          show={showGrade}
          dismissible
        >
          {(isCompleted && (
            <Alert.Heading>Congrats! You passed!</Alert.Heading>
          )) || <Alert.Heading>Sorry, you missed some.</Alert.Heading>}
          {(isCompleted && (
            <p>
              Well done! You&apos;re on your way to mastering your finances.
            </p>
          )) || (
            <p>
              Learning is a journey. Just by consuming {`"${card?.title}"`},
              you&apos;ve improved your financial skills. You&apos;ll get
              another chance to take take this quiz and improve your skills even
              more!
            </p>
          )}
        </Alert>
        <FeedbackForm quiz={card?.link} />
      </Modal.Body>
    </Modal>
  );
}
