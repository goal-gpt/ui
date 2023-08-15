import { useState } from "react";

import { SubscribeForm } from "./SubscribeForm";

type SubscribeButtonProps = {
  children: React.ReactNode;
};

const SubscribeButton = (props: SubscribeButtonProps) => {
  const [showForm, setShowForm] = useState(false);

  const showSubscribeForm = () => {
    setShowForm(true);
  };

  return (
    <>
      <button
        className="mx-auto rounded bg-blue-500 px-4 py-2 font-medium text-white shadow hover:bg-blue-600 hover:shadow-xl dark:bg-blue-700 hover:dark:bg-blue-800"
        onClick={showSubscribeForm}
      >
        {props.children}
      </button>
      {showForm && <SubscribeForm onClose={() => setShowForm(false)} />}
    </>
  );
};

export { SubscribeButton };
