import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import { fireEvent, render } from "@testing-library/react";

import { SubscribeForm } from "./SubscribeForm";

// Mocking necessary hooks and methods
jest.mock("@supabase/auth-helpers-react");
jest.mock("@tanstack/react-query");
jest.mock("next/router");

describe("SubscribeForm Component", () => {
  let mockMutate: jest.Mock;

  beforeEach(() => {
    mockMutate = jest.fn();
    (useUser as jest.Mock).mockReturnValue({});
    (useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
      isLoading: false,
      isError: false,
    });
    (useSupabaseClient as jest.Mock).mockReturnValue({});
  });

  it("renders login prompt if user is not authenticated", () => {
    (useUser as jest.Mock).mockReturnValue(null);

    const { getByText } = render(<SubscribeForm />);

    expect(
      getByText("You need to login to receive a detailed plan."),
    ).toBeInTheDocument();
  });

  it("renders name input on initial stage", () => {
    (useUser as jest.Mock).mockReturnValue({
      email: "test@example.com",
    });

    const { getByPlaceholderText, getByRole } = render(<SubscribeForm />);

    expect(getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("progresses to location input on next stage", () => {
    (useUser as jest.Mock).mockReturnValue({
      email: "test@example.com",
    });

    const { getByPlaceholderText, getByText } = render(<SubscribeForm />);

    fireEvent.click(getByText("Next"));

    expect(getByPlaceholderText("Your location")).toBeInTheDocument();
  });

  it("calls mutation on submit", async () => {
    const { getByText } = render(<SubscribeForm />);
    fireEvent.click(getByText("Next"));
    fireEvent.click(getByText("Next"));
    fireEvent.click(getByText("Submit"));

    expect(mockMutate).toHaveBeenCalled();
  });

  it("renders success message on successful mutation", () => {
    (useUser as jest.Mock).mockReturnValue({
      email: "test@example.com",
    });
    (useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isSuccess: true,
      isLoading: false,
      isError: false,
    });

    const { getByText } = render(<SubscribeForm />);

    expect(
      getByText(
        "Thank you for subscribing! You will receive your detailed plan within 24 hours.",
      ),
    ).toBeInTheDocument();
  });

  it("renders error message on failed mutation", () => {
    (useUser as jest.Mock).mockReturnValue({
      email: "test@example.com",
    });
    (useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isSuccess: false,
      isLoading: false,
      isError: true,
    });

    const { getByText } = render(<SubscribeForm />);

    expect(
      getByText("Sorry, we received an error. Please try again."),
    ).toBeInTheDocument();
  });
});
