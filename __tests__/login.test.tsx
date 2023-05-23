import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import Login from "../pages/login";

jest.mock("@supabase/auth-ui-react", () => ({
  Auth: jest.fn().mockReturnValue(
    <div role="form">
      <label htmlFor="password" className="supabase-auth-ui_ui-label c-bpexlo">
        Your password
      </label>
      <input id="password" />
    </div>
  ),
}));

describe("Login", () => {
  beforeEach(() => {
    (useSupabaseClient as jest.Mock).mockReturnValue({});
    (useUser as jest.Mock).mockReturnValue(null);
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  test("renders the Login component", () => {
    render(<Login />);
    const loginComponent = screen.getByRole("form");
    expect(loginComponent).toBeInTheDocument();
  });

  test("redirects to home if user is already logged in", () => {
    (useUser as jest.Mock).mockReturnValue({}); // User is logged in
    render(<Login />);
    expect(useRouter().push).toHaveBeenCalledWith("/");
  });

  test("sets the password label text correctly", () => {
    render(<Login />);
    const passwordLabel = screen.getByLabelText("Your password");
    expect(passwordLabel).toBeInTheDocument();
  });
});
