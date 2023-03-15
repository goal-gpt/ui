import "./QuizModal.scss";

import React, { useEffect, useRef, useState } from "react";
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
  const [timer, setTimer] = useState(5);
  const [message, setMessage] = useState(motivationalMessages[0]);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMessage(
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ]
    );
    timeRef.current = setInterval(() => {
      setTimer((time) => time - 1);
    }, 1000);

    return () => {
      if (timeRef.current) clearInterval(timeRef.current);
    };
  }, []);

  useEffect(() => {
    if (timer === 0 && timeRef.current) {
      clearInterval(timeRef.current);
      window.open(card?.link, "_blank");
    }
  }, [timer]);

  return (
    <Modal onHide={handleClose} show={show} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{message}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <Quiz quiz={card} /> */}
        <p>Your article will open in {timer} seconds.</p>
        <p>Hello! This is your quiz</p>
      </Modal.Body>
    </Modal>
  );
}
