import Link from "next/link";
import React from "react";

type FAQItem = {
  id: string;
  title: string;
  body: JSX.Element;
};

const faqs: FAQItem[] = [
  {
    id: "1",
    title: "What is eras?",
    body: (
      <>
        <p>
          eras is a tool to aid you with your financial literacy journey. Our
          app helps you make a plan, receive weekly guidance to accomplish that
          plan, and make progress on your financial goals.
        </p>
        <p>
          Our app is currently in beta. If you have any feedback, please email
          us at <Link href="mailto:eras.fyi@gmail.com">eras.fyi@gmail.com</Link>
          !
        </p>
      </>
    ),
  },
];

// Note: this serves as public documentation of our app, let's update it regularly.
// TODO: Features such as the 'undo' button should be added when they are implemented.
function Help() {
  return (
    <div className="py-4">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap">
          <div className="hidden w-1/12 md:block lg:block" />
          <div className="flex grow items-center justify-center">
            <h1 className="text-center text-2xl font-semibold">
              Frequently Asked Questions
            </h1>
          </div>
          <div className="hidden w-1/12 md:block lg:block" />
        </div>
        <div className="flex flex-wrap">
          <div className="hidden w-1/12 md:block lg:block" />
          <div className="grow">
            {faqs.map((item: FAQItem) => {
              return (
                <div key={item.id}>
                  <button className="text-neutral-dark block w-full border-b p-4 text-left">
                    {item.title}
                  </button>
                  <div className="text-neutral-light p-4">{item.body}</div>
                </div>
              );
            })}
          </div>
          <div className="hidden w-1/12 md:block lg:block" />
        </div>
      </div>
    </div>
  );
}

export default Help;
