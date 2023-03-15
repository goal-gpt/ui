import "./Main.scss";

import React, { useEffect, useState } from "react";

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
  const [lastCardLink, setLastCardLink] = useState("");

  const handleSelect = (card: CardItemData) => {
    setQuizState({ activeQuiz: card, showModal: true });
  };

  const handleRemove = (card: CardItemData) => {
    // TODO: add this to the user's history
    logger.info(`Removing ${card.title}`);
  };

  useEffect(() => {
    const cardLinks: string[] = JSON.parse(
      localStorage.getItem("eras.cardLinks") || "[]"
    );

    // Pushes empty string into the array when initialized
    // Leaving the empty string seem less harmful than checking that every `lastCardLink !== ""`
    cardLinks.push(lastCardLink);
    localStorage.setItem("eras.cardLinks", JSON.stringify(cardLinks));
  }, [lastCardLink]);

  return (
    <div className="main" role="main">
      <MainHeader />
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
            const link = quizState.activeQuiz?.link;
            if (link) setLastCardLink(link);
            setQuizState({ activeQuiz: null, showModal: false });
          }}
        />
      )}
    </div>
  );
}

export default Main;
