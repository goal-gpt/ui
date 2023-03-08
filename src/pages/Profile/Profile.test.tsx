import React from "react";

import { renderWithRouter, screen } from "../../utils/testHelpers";
import Profile from "./Profile";

test("checks that help is provided", () => {
  renderWithRouter(<Profile />);
  const headerImage = screen.getByText(/Your lovely profile is here/i);
  expect(headerImage).toBeInTheDocument();
});
