import type { FormEvent, ReactElement } from "react";

type IModalProps = {
  children: ReactElement;
  show: boolean;
  toggleModal: (e: FormEvent) => void;
};

const Modal = (props: IModalProps) => {
  return (
    props.show && (
      <div
        id="modal"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 max-h-full w-full overflow-y-auto overflow-x-hidden bg-slate-200/80 p-4 dark:bg-slate-800/80 md:inset-0"
        onClick={(e: FormEvent) => {
          if (
            e.currentTarget.id === "modal" &&
            e.target === document.getElementById("modal")
          ) {
            props.toggleModal(e);
          }
        }}
      >
        <div className="relative mx-auto flex h-screen max-h-full w-full max-w-md items-center justify-center">
          <div className="relative w-full rounded-lg bg-white text-center align-middle shadow-xl dark:bg-gray-700">
            <button
              type="button"
              className="absolute right-1 top-1 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={props.toggleModal}
            >
              <svg
                className="h-3 w-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            {props.children}
          </div>
        </div>
      </div>
    )
  );
};

export { Modal };
