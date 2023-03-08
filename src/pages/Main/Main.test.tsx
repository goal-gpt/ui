import React from "react";

import { renderWithRouter } from "../../utils/testHelpers";
import Main from "./Main";

test("checks that main is rendered", () => {
  const { getByRole } = renderWithRouter(<Main />);
  const headerImage = getByRole("main");
  expect(headerImage).toBeInTheDocument();
});
