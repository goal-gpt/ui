import "./Main.scss";

import React, { useState } from "react";
import { Container } from "react-bootstrap";

import { CardItemData, CardList } from "../../components/Card";
import { MainHeader } from "../../components/MainHeader";
import { QuizModal } from "../../components/Quiz";
import { cardItemData } from "../../services/cardItemData";
import { logger } from "../../utils/logger";

function Main() {
  const [quizState, setQuizState] = useState<{
    activeQuiz: CardItemData | null;
    showModal: boolean;
  }>({ activeQuiz: null, showModal: false });

  const handleSelect = (card: CardItemData) => {
    setQuizState({ activeQuiz: card, showModal: true });
  };

  const handleRemove = (card: CardItemData) => {
    // TODO: add this to the user's history
    logger.info(`Removing ${card.title}`);
  };

  return (
    <div className="main" role="main">
      <MainHeader />
      <Container>
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
            handleClose={() =>
              setQuizState({ activeQuiz: null, showModal: false })
            }
          />
        )}
      </Container>
    </div>
  );
}

export default Main;
