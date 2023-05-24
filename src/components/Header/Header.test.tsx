import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import { Header } from "./Header";

jest.mock("@supabase/auth-helpers-react", () => ({
  useSupabaseClient: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Header component", () => {
  let mockSignOut: jest.Mock;
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockSignOut = jest.fn().mockResolvedValue({ error: null });
    mockRouterPush = jest.fn();
    (useSupabaseClient as jest.Mock).mockReturnValue({
      auth: { signOut: mockSignOut },
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the logo", () => {
    render(<Header />);
    const headerImage = screen.getByAltText(
      /eras logo: yellow lines gradually reaching the horizon/i
    );
    expect(headerImage).toBeInTheDocument();
  });

  it("calls sign out function when 'Sign out' is clicked", () => {
    const { getByText } = render(<Header />);
    const profileElement = getByText("Your profile");
    fireEvent.click(profileElement);

    const signOutElement = getByText("Sign out");
    fireEvent.click(signOutElement);

    waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockRouterPush).toHaveBeenCalledWith("/login");
    });
  });
});
