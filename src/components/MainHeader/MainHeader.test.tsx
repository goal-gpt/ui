import { render, screen } from "@testing-library/react";
import React from "react";

import { MainHeader } from "./MainHeader";

test("renders the logo", () => {
  render(<MainHeader />);
  const headerImage = screen.getByAltText(
    /eras logo: yellow lines gradually reaching the horizon/i
  );
  expect(headerImage).toBeInTheDocument();
});
