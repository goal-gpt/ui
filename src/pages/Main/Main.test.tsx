import React from "react";

import { renderWithRouter, screen } from "../../utils/testHelpers";
import Main from "./Main";

test("checks that main is rendered", () => {
  renderWithRouter(<Main />);
  const headerImage = screen.getByText(/main/i);
  expect(headerImage).toBeInTheDocument();
});
