import { render, screen } from "@testing-library/react";
import React from "react";

import { Cookie } from "./Cookie";

describe("Cookie component", () => {
  test("renders the cookie consent banner with the correct message", () => {
    render(<Cookie />);

    const consentMessage = screen.getByText(
      /This website uses cookies and storage to help you with your financial journey. By using this website, you agree to our use of cookies and storage./i
    );

    expect(consentMessage).toBeInTheDocument();
  });

  test("renders the accept button with the correct text", () => {
    render(<Cookie />);

    const acceptButton = screen.getByText("Accept");

    expect(acceptButton).toBeInTheDocument();
  });
});
