import { render, screen } from "@testing-library/react";
import React from "react";

import Help from ".";

test("checks that help is provided", () => {
  render(<Help />);
  const headerImage = screen.getByText(/Frequently Asked Questions/i);
  expect(headerImage).toBeInTheDocument();
});
