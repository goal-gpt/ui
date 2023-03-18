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
  const [lastCompletedCardLink, setLastCompletedCardLink] = useState("");

  const handleSelect = (card: CardItemData) => {
    setQuizState({ activeQuiz: card, showModal: true });
  };

  const handleRemove = (card: CardItemData) => {
    // TODO: add this to the user's history
    logger.info(`Removing ${card.title}`);
  };

  const getCardLinks = (): string[] => {
    return JSON.parse(localStorage.getItem("eras.completedCardLinks") || "[]");
  };

  const storeCardLinks = (cardLinks: string[]) => {
    localStorage.setItem("eras.completedCardLinks", JSON.stringify(cardLinks));
  };

  useEffect(() => {
    const completedCardLinks = getCardLinks();

    completedCardLinks.push(lastCompletedCardLink);
    storeCardLinks(completedCardLinks);

    return () => {
      const cardLinksToCleanUp = getCardLinks();

      const cleanedUpCardLinks = cardLinksToCleanUp.filter((link) => {
        return link !== "";
      });

      storeCardLinks(cleanedUpCardLinks);
    };
  }, [lastCompletedCardLink]);

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
          handleClose={(isCompleted: boolean) => {
            const link = quizState.activeQuiz?.link;
            if (isCompleted && link) setLastCompletedCardLink(link);
            setQuizState({ activeQuiz: null, showModal: false });
          }}
        />
      )}
    </div>
  );
}

export default Main;
