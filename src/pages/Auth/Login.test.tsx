import React from "react";

import { renderWithRouter } from "../../utils/testHelpers";
import Login from "./Login";

// Mock the Supabase client
jest.mock("../../services/supabase", () => {
  const mockSignInWithOtp = async (email: string) => {
    return {
      error: null,
      data: {
        id: "123",
        email,
      },
    };
  };

  return {
    supabase: {
      auth: {
        signInWithOtp: mockSignInWithOtp,
      },
    },
  };
});

describe("Login", () => {
  it("renders the main header", () => {
    const { getByText } = renderWithRouter(<Login />);
    const headerElement = getByText(/Sign in/i);
    expect(headerElement).toBeInTheDocument();
  });
});
