import React from "react";

import { renderWithRouter, screen } from "../../src/utils/testHelpers";
import Help from ".";

test("checks that help is provided", () => {
  renderWithRouter(<Help />);
  const headerImage = screen.getByText(/Frequently Asked Questions/i);
  expect(headerImage).toBeInTheDocument();
});
