import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as ReactRouterDOM from "react-router-dom";

import { Error } from "./Error";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useRouteError: jest.fn(),
 }));

 describe("Error component", () => {
  it("renders default error message when no message prop is passed", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Error />
      </MemoryRouter>
    );

    expect(getByText("Sorry, an unexpected error has occurred.")).toBeInTheDocument();
  });

  it("renders custom error message when message prop is passed", () => {
    const error = { message: "Custom error message" };
    jest.spyOn(ReactRouterDOM, "useRouteError").mockReturnValue(error);

    const { getByText } = render(
      <MemoryRouter>
        <Error />
      </MemoryRouter>
    );

    expect(getByText("Custom error message")).toBeInTheDocument();
  });

  it("displays route error response when there's an error object returned by useRouteError", () => {
    const error = { status: 404, statusText: "Not Found" };
    jest.spyOn(ReactRouterDOM, "useRouteError").mockReturnValue(error);

    const { getByText } = render(
      <MemoryRouter>
        <Error />
      </MemoryRouter>
    );

    expect(getByText(`${error.status} ${error.statusText}`)).toBeInTheDocument();
  });

  it("doesn't display route error response when there's no error object returned by useRouteError", () => {
    jest.spyOn(ReactRouterDOM, "useRouteError").mockReturnValue(null);

    const { queryByText } = render(
      <MemoryRouter>
        <Error />
      </MemoryRouter>
    );

    expect(queryByText(/(\d+) (\w+)/)).toBeNull();
  });
});
