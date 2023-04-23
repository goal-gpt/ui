import { Session } from "@supabase/gotrue-js";
import { fireEvent, screen } from "@testing-library/react";
import React from "react";

import { useAuth } from "../../pages/Auth/RequireAuth";
import { renderWithRouter } from "../../utils";
import LoginToggle from "./LoginToggle";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));
jest.mock("../../pages/Auth/RequireAuth");
const authMock = useAuth as jest.MockedFunction<typeof useAuth>;

describe("LoginToggle", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders login button when there is no session", () => {
    authMock.mockReturnValue({ session: null });

    renderWithRouter(<LoginToggle />);

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("navigates to /login when login button is clicked", () => {
    authMock.mockReturnValue({ session: null });

    renderWithRouter(<LoginToggle />);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("renders UserIndicator when there is a session", () => {
    authMock.mockReturnValue({
      session: { user: { id: "123", email: "user@example.com" } } as Session,
    });

    renderWithRouter(<LoginToggle />);

    expect(
      screen.queryByRole("button", { name: /login/i })
    ).not.toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });
});
