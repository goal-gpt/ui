import React from "react";

import { renderWithRouter, screen } from "../../utils/testHelpers";
import Help from "./Help";

test("checks that help is provided", () => {
  renderWithRouter(<Help />);
  const headerImage = screen.getByText(/Frequently Asked Questions/i);
  expect(headerImage).toBeInTheDocument();
});
