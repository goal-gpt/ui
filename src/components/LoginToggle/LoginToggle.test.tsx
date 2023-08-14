import { useUser } from "@supabase/auth-helpers-react";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import { LoginToggle } from "./LoginToggle";

jest.mock("@supabase/auth-helpers-react", () => ({
  useUser: jest.fn(),
}));

describe("LoginToggle", () => {
  it("renders Login button if user is not logged in", () => {
    (useUser as jest.Mock).mockReturnValue(null);
    render(<LoginToggle />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("renders UserIndicator if user is logged in", () => {
    (useUser as jest.Mock).mockReturnValue({ email: "test@email.com" });
    render(<LoginToggle />);
    expect(screen.getByText("test@email.com")).toBeInTheDocument();
  });

  it("navigates to /login when Login button is clicked", () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useUser as jest.Mock).mockReturnValue(null);

    render(<LoginToggle />);
    screen.getByText("Sign in").click();

    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
