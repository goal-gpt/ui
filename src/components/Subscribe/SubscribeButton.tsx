import type { FormEvent } from "react";
import { useState } from "react";

import { Modal } from "../Modal/Modal";
import { SubscribeForm } from "./SubscribeForm";

type SubscribeButtonProps = {
  children: React.ReactNode;
};

const SubscribeButton = (props: SubscribeButtonProps) => {
  const [showForm, setShowForm] = useState(false);

  const showSubscribeForm = () => {
    setShowForm(true);
  };

  const toggleModalVisibility = (e: FormEvent) => {
    e.preventDefault();
    setShowForm(!showForm);
  };

  return (
    <>
      <button
        className="mx-auto mt-2 rounded bg-blue-500 px-4 py-2 font-medium text-white shadow hover:bg-blue-600 hover:shadow-xl dark:bg-blue-700 hover:dark:bg-blue-800"
        onClick={showSubscribeForm}
      >
        {props.children}
      </button>
      <Modal show={showForm} toggleModal={toggleModalVisibility}>
        <SubscribeForm />
      </Modal>
    </>
  );
};

export { SubscribeButton };
