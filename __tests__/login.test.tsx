import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import React from "react";

import Login from "../pages/login";

jest.mock("@supabase/auth-helpers-react", () => ({
  useUser: jest.fn(),
  useSupabaseClient: jest.fn(),
}));

describe("Login", () => {
  it("renders without crashing", () => {
    (useUser as jest.Mock).mockReturnValue(null);
    render(<Login />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("redirects to profile if user is logged in", async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useUser as jest.Mock).mockReturnValue({});

    render(<Login />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/profile"));
  });

  it("submits the form and calls signInWithOtp", async () => {
    const mockSignInWithOtp = jest.fn().mockResolvedValue({ error: null });
    (useSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithOtp: mockSignInWithOtp,
      },
    });
    (useUser as jest.Mock).mockReturnValue(null);

    render(<Login />);
    await userEvent.type(
      screen.getByPlaceholderText("Your email"),
      "test@example.com"
    );
    fireEvent.submit(screen.getByText("Get Magic Link!"));

    await waitFor(() =>
      expect(mockSignInWithOtp).toHaveBeenCalledWith({
        email: "test@example.com",
        options: { emailRedirectTo: window.location.origin },
      })
    );
  });
});
