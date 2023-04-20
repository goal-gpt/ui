import React from "react";

import { renderWithRouter } from "../../utils/testHelpers";
import Signup from "./Signup";

describe("Signup", () => {
  it("is correctly rendered", () => {
    const { getByText } = renderWithRouter(<Signup />);
    const headerElement = getByText(/Sign up/i);
    expect(headerElement).toBeInTheDocument();
  });
});
