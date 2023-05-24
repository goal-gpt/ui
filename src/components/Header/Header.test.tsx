import { render, screen } from "@testing-library/react";
import React from "react";

import { Header } from "./Header";

it("renders the logo", () => {
  render(<Header />);
  const headerImage = screen.getByAltText(
    /eras logo: yellow lines gradually reaching the horizon/i
  );
  expect(headerImage).toBeInTheDocument();
});
