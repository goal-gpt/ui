import "./QuizModal.scss";

import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

import { CardItemData } from "../Card";

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

export interface QuizFormProps {
  handleClose: (isCompleted: boolean) => void;
}

// TODO: replace with proper quiz logic
function QuizForm(props: QuizFormProps) {
  const [formValue, setFormValue] = useState(false);
  const { handleClose } = props;

  return (
    <Form
      onSubmit={(ev) => {
        ev.preventDefault();
        handleClose(formValue);
      }}
    >
      <div key="default-radio" className="mb-3">
        <Form.Check
          type="radio"
          id="quiz-radio-true"
          label="true (correct answer)"
          value="true"
          checked={formValue === true}
          onChange={() => setFormValue(true)}
        />

        <Form.Check
          type="radio"
          label="false"
          id="quiz-radio-false"
          value="false"
          checked={formValue === false}
          onChange={() => setFormValue(false)}
        />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
}

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
    <Modal
      onHide={() => handleClose(false)}
      show={show}
      backdrop="static"
      keyboard={false}
    >
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
        <QuizForm
          handleClose={(isCompleted) => {
            handleClose(isCompleted);
          }}
        />
      </Modal.Body>
    </Modal>
  );
}
