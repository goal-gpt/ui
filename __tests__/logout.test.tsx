import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { act, render } from "@testing-library/react";
import { useRouter } from "next/router";

import Logout from "../pages/logout";

// Mocking necessary hooks and methods
jest.mock("@supabase/auth-helpers-react", () => ({
  useUser: jest.fn(),
  useSupabaseClient: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Logout Component", () => {
  let mockSignOut: jest.Mock;
  let mockPush: jest.Mock;
  beforeEach(() => {
    mockSignOut = jest.fn();
    mockPush = jest.fn();
  });

  it("calls signOut and redirects to / if user is present", async () => {
    // Mock return values for hooks
    (useUser as jest.Mock).mockReturnValue({});
    (useSupabaseClient as jest.Mock).mockReturnValue({
      auth: { signOut: mockSignOut },
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    await act(async () => {
      render(<Logout />);
    });

    expect(mockSignOut).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("does not call signOut or redirect if user is not present", async () => {
    // Mock return values for hooks
    (useUser as jest.Mock).mockReturnValue(null);
    (useSupabaseClient as jest.Mock).mockReturnValue({
      auth: { signOut: mockSignOut },
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    await act(async () => {
      render(<Logout />);
    });

    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
