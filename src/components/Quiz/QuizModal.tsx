import "./QuizModal.scss";

import React, { SetStateAction, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

import { CardItemData, GameItem } from "../Card";

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
  card: CardItemData | null;
}

export interface PlayProps {
  gameItem: GameItem;
  gameItemIndex: number;
  formValues: object;
  setFormValues: React.Dispatch<SetStateAction<object>>;
}

function Play(props: PlayProps) {
  const [responses, setResponses] = useState<string[]>([]);
  const [formValue, setFormValue] = useState("");
  const { gameItem, gameItemIndex, formValues, setFormValues } = props;

  useEffect(() => {
    const unsortedResponses = gameItem.incorrectAnswers
      ? [gameItem.correctAnswer].concat(gameItem.incorrectAnswers)
      : [gameItem.correctAnswer];
    setResponses(unsortedResponses.sort(() => Math.random() - 0.5));
  }, []);

  return (
    <>
      <p>{gameItem.question}</p>
      {responses.map((response, i) => (
        <Form.Check
          key={`${gameItem.question} ${response}`}
          type="radio"
          id={`quiz-play-${gameItemIndex}-${i}`}
          label={response}
          value={response}
          name={gameItem.question}
          checked={formValue === response}
          onChange={(e) => {
            // Set value for this gameItem
            setFormValue(e.target.value);

            // Set values for the quiz
            setFormValues({
              ...formValues,
              [e.target.name]: e.target.value,
            });
          }}
        />
      ))}
    </>
  );
}

function QuizForm(props: QuizFormProps) {
  const [formValues, setFormValues] = useState({});
  const { handleClose, card } = props;

  const gradeQuiz = () => {
    if (!card) handleClose(false);
    else {
      const results = card.gameItems.map((gameItem) => {
        return (
          formValues[gameItem.question as keyof object] ===
          gameItem.correctAnswer
        );
      });

      // Set isCompleted to false if any answers are incorrect
      const isCompleted = !results.some((result) => {
        return result === false;
      });

      console.log(`isCompleted: ${isCompleted}!`);
      handleClose(isCompleted);
    }
  };

  return (
    <Form
      onSubmit={(ev) => {
        ev.preventDefault();
        gradeQuiz();
      }}
    >
      <div key="default-radio" className="mb-3">
        {card?.gameItems.map((gameItem, i) => (
          <Play
            key={gameItem.question}
            gameItem={gameItem}
            gameItemIndex={i}
            formValues={formValues}
            setFormValues={setFormValues}
          />
        ))}
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
        <hr />
        <h3>Quiz</h3>
        <QuizForm
          handleClose={(isCompleted) => {
            handleClose(isCompleted);
          }}
          card={card}
        />
      </Modal.Body>
    </Modal>
  );
}
