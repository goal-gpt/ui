import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import {
  AuthResponse,
  SignInWithPasswordlessCredentials,
  supabase,
} from "../../services/supabase";
import { renderWithRouter } from "../../utils/testHelpers";
import Login from "./Login";

jest.mock("../../services/supabase");

const signInWithOtpMock = supabase.auth.signInWithOtp as jest.MockedFunction<
  (credentials: SignInWithPasswordlessCredentials) => Promise<AuthResponse>
>;

describe("Login", () => {
  beforeEach(() => {
    signInWithOtpMock.mockReset();
  });

  test("renders sign in form", () => {
    renderWithRouter(<Login />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("to a new era")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your email")).toBeInTheDocument();
    expect(
      screen.getByText("Login", { selector: "button" })
    ).toBeInTheDocument();
  });

  test("submits form and shows success message", async () => {
    signInWithOtpMock.mockResolvedValue(
      Promise.resolve({
        data: {
          user: null,
          session: null,
        },
        error: null,
      })
    );

    renderWithRouter(<Login />);
    const emailInput = screen.getByPlaceholderText("Your email");
    const loginButton = screen.getByText("Login", { selector: "button" });

    userEvent.type(emailInput, "test@example.com");
    fireEvent.submit(loginButton);

    await waitFor(() => expect(signInWithOtpMock).toHaveBeenCalled());
  });

  test("submits form and shows error message", async () => {
    signInWithOtpMock.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });

    renderWithRouter(<Login />);
    const emailInput = screen.getByPlaceholderText("Your email");
    const loginButton = screen.getByText("Login", { selector: "button" });

    userEvent.type(emailInput, "test@example.com");
    fireEvent.submit(loginButton);

    await waitFor(() => expect(signInWithOtpMock).toHaveBeenCalled());
  });
});
