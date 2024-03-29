import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { Header } from "./Header";

jest.mock("@supabase/auth-helpers-react");

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Header component", () => {
  let mockSignOut: jest.Mock;

  beforeEach(() => {
    mockSignOut = jest.fn().mockResolvedValue({ error: null });
    (useSupabaseClient as jest.Mock).mockReturnValue({
      auth: { signOut: mockSignOut },
    });
    (useUser as jest.Mock).mockReturnValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls sign out function when 'Sign out' is clicked", () => {
    (useUser as jest.Mock).mockReturnValue({});
    const { getByText } = render(<Header />);
    const profileElement = getByText("Your profile");
    fireEvent.click(profileElement);

    const signOutElement = getByText("Sign out");
    fireEvent.click(signOutElement);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
