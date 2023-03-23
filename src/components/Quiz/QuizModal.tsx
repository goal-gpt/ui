import "./QuizModal.scss";

import React, { SetStateAction, useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
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
  setIsCompleted: React.Dispatch<SetStateAction<boolean>>;
  setShowGrade: React.Dispatch<SetStateAction<boolean>>;
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
  const { setIsCompleted, setShowGrade, card } = props;
  // const [showQuizAlert, setShowQuizAlert] = useState(false);
  // const [isCompleted, setIsCompleted] = useState(false);

  const gradeQuiz = (event: React.FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault();
    if (!card) return false;

    const results = card.gameItems.map((gameItem) => {
      return (
        formValues[gameItem.question as keyof object] === gameItem.correctAnswer
      );
    });

    // Set grade to false if any answers are incorrect
    const grade = !results.some((result) => {
      return result === false;
    });

    console.log(`grade: ${grade}!`);
    return grade;
  };

  return (
    <Form
      onSubmit={(event) => {
        const grade = gradeQuiz(event);
        setIsCompleted(grade);
        setShowGrade(true);
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
  const [showGrade, setShowGrade] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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
          {isCompleted && <Alert.Heading>Congrats! You passed!</Alert.Heading>}
          {!isCompleted && (
            <Alert.Heading>Sorry, you missed a few.</Alert.Heading>
          )}
          {isCompleted && (
            <p>Well done! You&apos;re on your way to mastering your finances</p>
          )}
          {!isCompleted && (
            <p>
              Learning is a journey. Just by consuming {`"${card?.title}"`},
              you&apos;ve improved your financial skills. You&apos;ll get
              another chance to take take this quiz and improve your skills even
              more!
            </p>
          )}
        </Alert>
      </Modal.Body>
    </Modal>
  );
}
