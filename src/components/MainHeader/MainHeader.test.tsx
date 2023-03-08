import React from "react";

import { renderWithRouter, screen } from "../../utils/testHelpers";
import { MainHeader } from "./MainHeader";

test("renders the logo", () => {
  renderWithRouter(<MainHeader />);
  const headerImage = screen.getByAltText(
    /eras logo: yellow lines gradually reaching the horizon/i
  );
  expect(headerImage).toBeInTheDocument();
});
