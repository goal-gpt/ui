import React from "react";

import { renderWithRouter } from "../../utils/testHelpers";
import Main from "./Main";

describe("Main component", () => {
  test("checks that main is rendered", () => {
    const { getByRole } = renderWithRouter(<Main />);
    const headerImage = getByRole("main");
    expect(headerImage).toBeInTheDocument();
  });

  test("it stores links for completed quizzes in localstorage", () => {
    // TODO
  });
});
