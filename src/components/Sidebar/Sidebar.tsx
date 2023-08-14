import Link from "next/link";
import React, { useState } from "react";

import { Logo } from "../Logo/Logo";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed h-12 w-full bg-blue-500 shadow-md dark:bg-blue-800 sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="default-sidebar"
          type="button"
          className="ml-2 mt-1 inline-flex h-10 items-center rounded-lg p-2 py-0 text-sm text-slate-700 hover:bg-blue-600 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:text-slate-200 dark:hover:bg-blue-600 dark:hover:text-slate-100 dark:focus:ring-slate-500 sm:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>
      </div>

      <aside
        id="default-sidebar"
        className={`fixed left-0 top-0 h-screen w-64 transition-transform sm:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <button
          type="button"
          className="absolute right-2.5 top-3 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-600 hover:bg-gray-400 hover:text-gray-800 dark:hover:bg-gray-600 dark:hover:text-white sm:hidden"
          onClick={() => setIsOpen(false)}
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
        <div className="h-full overflow-y-auto bg-gray-200 px-3 py-4 dark:bg-gray-800">
          <div className="mx-auto mb-4 flex flex-row justify-center border-b-2 border-slate-300 pb-4 dark:border-slate-700">
            <Link href="/">
              <Logo xl />
            </Link>
          </div>
          <ul className="space-y-2 font-medium">
            {/* TODO: keeping this here as it's likely the next piece of functionality to build */}
            {/* <li>
              <Link
                href="#"
                className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  className="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-800 dark:text-gray-500 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ml-3 text-gray-700 group-hover:text-gray-900 dark:text-gray-400 group-hover:dark:text-gray-200">
                  Your Plans
                </span>
              </Link>
            </li> */}
            <li>
              <Link
                href="/login"
                className="group flex items-center rounded-md p-2 hover:bg-gray-400 dark:hover:bg-gray-700"
              >
                <svg
                  className="h-5 w-5 transition duration-75 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                  />
                </svg>
                <span className="ml-3 group-hover:text-gray-900 dark:text-gray-400 group-hover:dark:text-gray-100">
                  Sign In
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export { Sidebar };
