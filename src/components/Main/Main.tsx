import React, { useEffect, useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";

import { cardItemData } from "../../services/cardItemData";
import { logger } from "../../utils/logger";
import { CardItemData, CardList } from "../Card";
import { MainHeader } from "../MainHeader";
import { QuizModal } from "../Quiz";

function Main() {
  const [quizState, setQuizState] = useState<{
    activeQuiz: CardItemData | null;
    showModal: boolean;
  }>({ activeQuiz: null, showModal: false });
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  const handleSelect = (card: CardItemData) => {
    setQuizState({ activeQuiz: card, showModal: true });
  };

  const handleRemove = (card: CardItemData) => {
    // TODO: add this to the user's history
    logger.info(`Removing ${card.title}`);
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    window.localStorage.setItem("eras.welcomed", "true");
  };

  useEffect(() => {
    const welcomed = window.localStorage.getItem("eras.welcomed") || "false";

    setShowWelcome(welcomed === "false");
  }, []);

  return (
    <div className="main" role="main">
      <MainHeader />
      <Row>
        <Col md={3} xs={1} />
        <Col>
          <Alert
            variant="info"
            onClose={handleWelcomeClose}
            show={showWelcome}
            transition={false}
            closeLabel="close-welcome"
            dismissible
          >
            <Alert.Heading>
              Welcome to <b>eras</b> v0.2 🌅!
            </Alert.Heading>
            <p>
              Improving your personal finance skills is a journey. We are glad
              to be on it with you!
            </p>
            <hr />
            <p className="mb-0">
              We are constantly making the app better. If you have any
              suggestions or other feedback, send us an email:{" "}
              <Alert.Link href="mailto:eras.fyi@gmail.com">
                eras.fyi@gmail.com
              </Alert.Link>
              .
            </p>
          </Alert>
        </Col>
        <Col md={3} xs={1} />
      </Row>
      <CardList
        cardItemData={cardItemData}
        selectCard={handleSelect}
        removeCard={handleRemove}
      />
      {/* This pattern is needed to implement a "new" modal with each quiz */}
      {quizState.showModal && (
        <QuizModal
          card={quizState.activeQuiz}
          show={quizState.showModal}
          handleClose={() => {
            setQuizState({ activeQuiz: null, showModal: false });
          }}
        />
      )}
    </div>
  );
}

export default Main;
