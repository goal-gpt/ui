import type { ReactNode } from "react";
import React, { useContext, useEffect, useState } from "react";

import { QueryStatus } from "../../hooks/useChat";
import { loadingItemData } from "../../services/loadingItemData";
import { ChatContext } from "../Chat";
import type { LoadingItemData } from "./LoadingItem";
import { LoadingItemType } from "./LoadingItem";

type CarouselProps = {
  items: LoadingItemData[];
};

function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const changeItem = () => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setIsFading(false);
      }, 1000); // This is the duration of the fade-out effect
    };

    const interval = setInterval(changeItem, 5000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [items]);

  const getLoadingText = (
    index: number,
    type: LoadingItemType,
    text: string,
  ): ReactNode => {
    // Delay initially showing anything
    if (index === 0) return "";
    if (index % 4 === 0) return "Working on your personalized action plan...";
    if (type === LoadingItemType.Fact) return `Did you know: ${text}`;

    // Return italicized text when the LoadingItemType is Quote
    if (type === LoadingItemType.Quote) return <i>{`"${text}"`}</i>;

    return `"${text}"`;
  };

  return (
    <div className="my-4 flex justify-center overflow-x-hidden">
      <div
        className={`px-4 transition-all duration-1000 ${
          isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="text-center text-slate-800 dark:text-slate-200">
          {getLoadingText(
            currentIndex,
            items[currentIndex]!.type,
            items[currentIndex]!.text,
          )}
        </p>
      </div>
    </div>
  );
}

export function Status() {
  const chatContext = useContext(ChatContext);
  const { chatStatus } = chatContext || {
    chatStatus: QueryStatus.Loading,
  };
  const [randomizedItems, setRandomizedItems] = useState(loadingItemData);

  useEffect(() => {
    const shuffledItems = [...loadingItemData].sort(() => Math.random() - 0.5);

    setRandomizedItems(shuffledItems);
  }, [loadingItemData]);

  if (chatStatus === QueryStatus.Success || chatStatus === QueryStatus.Idle) {
    return null;
  }

  if (chatStatus === QueryStatus.Error) {
    return (
      <div className="flex justify-center">
        <div className="text-center">
          <p className="text-red-500">
            Sorry, an error occurred. Please try again!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="my-3 flex justify-center overflow-x-hidden">
        <div className="text-center" role="status">
          <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-blue-600 dark:border-blue-300 dark:text-slate-200"></div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      <div className="my-4 flex justify-center overflow-x-hidden">
        <div className="text-center">
          <div>
            <Carousel items={randomizedItems} />
          </div>
        </div>
      </div>
    </>
  );
}
