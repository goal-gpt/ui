import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";

export const renderWithRouter = (
  ui: React.ReactElement,
  { route = "/" }: { route?: string } = {}
) => {
  window.history.pushState({}, "Test page", route);

  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: MemoryRouter,
    }),
  };
};

export * from "@testing-library/react";
export * from "react-router-dom";
