import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import Login from "../pages/login";
import { toast } from "../src/utils";

jest.mock("@supabase/auth-helpers-react");
jest.mock("next/router");
jest.mock("../src/utils", () => ({
  ...jest.requireActual("../src/utils"),
  toast: jest.fn(),
}));

describe("Login", () => {
  let mockPush: jest.Mock;
  let mockedUser: object | null;

  beforeEach(() => {
    mockPush = jest.fn();
    mockedUser = null;
    (useSupabaseClient as jest.Mock).mockReturnValue({});
    (useUser as jest.Mock).mockReturnValue(mockedUser);
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders without crashing", () => {
    render(<Login isAuthChecking={false} />);
    expect(useUser).toBeCalled();
    expect(useRouter).toBeCalled();
    expect(useSupabaseClient).toBeCalled();
    const loginForm = screen.getByRole("form");
    expect(loginForm).toBeInTheDocument();
  });

  it("renders the Login component if isAuthChecking is false", () => {
    render(<Login isAuthChecking={false} />);
    const loginComponent = screen.getByRole("form");
    expect(loginComponent).toBeInTheDocument();
  });

  it("renders the Login component if isAuthChecking is true", async () => {
    render(<Login isAuthChecking={true} />);
    const loginComponent = screen.getByRole("form");
    expect(loginComponent).toBeInTheDocument();
  });

  it("redirects to homepage if user exists", async () => {
    mockedUser = { name: "John Doe", id: 1 };
    (useUser as jest.Mock).mockReturnValue(mockedUser);

    await act(async () => {
      render(<Login isAuthChecking={false} />);
    });

    expect(mockPush).toBeCalledWith("/");
  });

  it("handles input change", async () => {
    const { getByPlaceholderText } = render(<Login isAuthChecking={false} />);
    const input = getByPlaceholderText("Enter your email");

    await act(async () => {
      fireEvent.change(input, { target: { value: "test@example.com" } });
    });

    expect(screen.getByDisplayValue("test@example.com") === input).toBeTruthy();
  });

  it("handles login success", async () => {
    (useSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithOtp: jest.fn().mockResolvedValue({ error: null }),
      },
    });
    const { getByText, getByPlaceholderText } = render(
      <Login isAuthChecking={false} />
    );
    const input = getByPlaceholderText("Enter your email");
    const button = getByText("Get your login link");

    fireEvent.change(input, { target: { value: "test@example.com" } });

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        "Check your email for the login link!",
        { type: "info" }
      );
      expect(getByText("Check your email!")).toBeInTheDocument();
    });
  });

  it("redirects to home if user is already logged in", () => {
    (useUser as jest.Mock).mockReturnValue({}); // User is logged in
    render(<Login isAuthChecking={false} />);
    expect(useRouter().push).toHaveBeenCalledWith("/");
  });
});
