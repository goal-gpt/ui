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

import { useLogin } from "@/hooks/useLogin";

import Login from "../pages/login";
import { createWrapper } from "../src/utils";

jest.mock("@supabase/auth-helpers-react");
jest.mock("next/router");
jest.mock("../src/utils");
jest.mock("../src/hooks/useLogin");

describe("Login", () => {
  let mockPush: jest.Mock;
  let mockedUser: object | null;
  let mockSendOtp: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockedUser = null;
    mockSendOtp = jest.fn();
    (useSupabaseClient as jest.Mock).mockReturnValue({});
    (useUser as jest.Mock).mockReturnValue(mockedUser);
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useLogin as jest.Mock).mockReturnValue({ sendOtp: mockSendOtp });
  });

  it("renders without crashing", () => {
    render(<Login isAuthChecking={false} />, { wrapper: createWrapper() });
    expect(useUser).toBeCalled();
    expect(useRouter).toBeCalled();
    const loginForm = screen.getByRole("form");
    expect(loginForm).toBeInTheDocument();
  });

  it("renders the Login component if isAuthChecking is false", () => {
    render(<Login isAuthChecking={false} />, { wrapper: createWrapper() });
    const loginComponent = screen.getByRole("form");
    expect(loginComponent).toBeInTheDocument();
  });

  it("renders the Login component if isAuthChecking is true", async () => {
    render(<Login isAuthChecking={true} />, { wrapper: createWrapper() });
    const loginComponent = screen.getByRole("form");
    expect(loginComponent).toBeInTheDocument();
  });

  it("redirects to homepage if user exists", async () => {
    mockedUser = { name: "John Doe", id: 1 };
    (useUser as jest.Mock).mockReturnValue(mockedUser);

    await act(async () => {
      render(<Login isAuthChecking={false} />, { wrapper: createWrapper() });
    });

    expect(mockPush).toBeCalledWith("/");
  });

  it("handles input change", async () => {
    const { getByPlaceholderText } = render(<Login isAuthChecking={false} />, {
      wrapper: createWrapper(),
    });
    const input = getByPlaceholderText("Enter your email");

    await act(async () => {
      fireEvent.change(input, { target: { value: "test@example.com" } });
    });

    expect(screen.getByDisplayValue("test@example.com") === input).toBeTruthy();
  });

  it("handles login success", async () => {
    (useLogin as jest.Mock)
      .mockReturnValueOnce({
        sendOtp: jest.fn().mockResolvedValue({ error: null }),
        status: "idle",
      })
      .mockReturnValueOnce({
        sendOtp: jest.fn().mockResolvedValue({ error: null }),
        status: "success",
      });
    const { getByText, getByPlaceholderText } = render(
      <Login isAuthChecking={false} />,
      { wrapper: createWrapper() },
    );
    const input = getByPlaceholderText("Enter your email");
    const button = getByText("Get your login link");

    fireEvent.change(input, { target: { value: "test@example.com" } });

    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(getByText("Check your email!")).toBeInTheDocument();
    });
  });

  it("redirects to home if user is already logged in", () => {
    (useUser as jest.Mock).mockReturnValue({}); // User is logged in
    render(<Login isAuthChecking={false} />, { wrapper: createWrapper() });
    expect(useRouter().push).toHaveBeenCalledWith("/");
  });
});
