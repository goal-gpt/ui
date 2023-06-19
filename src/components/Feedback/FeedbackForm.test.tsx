import "@testing-library/jest-dom/extend-expect";

import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { logger, sendEmailJS } from "../../utils";
import { FeedbackForm } from "./FeedbackForm";

jest.mock("../../utils");

describe("FeedbackForm", () => {
  beforeEach(() => {
    (sendEmailJS as jest.Mock).mockResolvedValue({ status: 200, text: "OK" });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the form correctly", () => {
    const { getByRole } = render(<FeedbackForm />);

    expect(
      getByRole("button", { name: /Share your feedback!/i })
    ).toBeInTheDocument();
  });

  it("handles user input in textareas", async () => {
    const { getByRole } = render(<FeedbackForm />);

    await userEvent.click(
      getByRole("button", { name: /Share your feedback!/i })
    );

    const commentInput = getByRole("textbox", {
      name: /Share any comments.../i,
    });
    await userEvent.type(commentInput, "Great feedback!");
    expect(commentInput).toHaveValue("Great feedback!");

    const emailInput = getByRole("textbox", { name: /...and your email!/i });
    await userEvent.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");
  });

  it("should toggle thumbs up and thumbs down correctly", async () => {
    const { getByLabelText, getByRole } = render(<FeedbackForm />);
    await userEvent.click(
      getByRole("button", { name: /Share your feedback!/i })
    );

    const thumbsUp = getByLabelText(/hand-thumbs-up/i);
    const thumbsDown = getByLabelText(/hand-thumbs-down/i);

    expect(thumbsUp).toBeInTheDocument();
    expect(thumbsDown).toBeInTheDocument();

    await userEvent.click(thumbsUp);
    expect(getByLabelText(/hand-thumbs-up-fill/i)).toBeInTheDocument();
    expect(getByLabelText(/hand-thumbs-down/i)).toBeInTheDocument();

    await userEvent.click(thumbsUp); // Clicking thumbs up fill to unset it
    expect(getByLabelText(/hand-thumbs-up/i)).toBeInTheDocument();
    expect(getByLabelText(/hand-thumbs-down/i)).toBeInTheDocument();

    await userEvent.click(thumbsDown);
    expect(getByLabelText(/hand-thumbs-down-fill/i)).toBeInTheDocument();
    expect(getByLabelText(/hand-thumbs-up/i)).toBeInTheDocument();

    await userEvent.click(thumbsDown); // Clicking thumbs down fill to unset it
    expect(getByLabelText(/hand-thumbs-down/i)).toBeInTheDocument();
    expect(getByLabelText(/hand-thumbs-up/i)).toBeInTheDocument();
  });

  it("should send email with feedback", async () => {
    const { getByLabelText, getByRole } = render(<FeedbackForm />);
    await userEvent.click(
      getByRole("button", { name: /Share your feedback!/i })
    );

    await userEvent.click(getByLabelText(/hand-thumbs-up/i));
    await userEvent.type(
      getByLabelText(/Share any comments.../i),
      "Great feedback!"
    );
    await userEvent.type(
      getByLabelText(/...and your email!/i),
      "test@example.com"
    );
    await userEvent.click(getByRole("button", { name: /Submit/i }));

    expect(sendEmailJS).toHaveBeenCalledTimes(1);
    expect(sendEmailJS).toHaveBeenCalledWith({
      rating: "up",
      comments: "Great feedback!",
      email: "test@example.com",
    });
  });

  it("should show a loading spinner when sending feedback, clear the form on success and close the form", async () => {
    const { getByLabelText, getByRole } = render(<FeedbackForm />);
    await userEvent.click(
      getByRole("button", { name: /Share your feedback!/i })
    );
    await userEvent.click(getByLabelText(/hand-thumbs-up/i));
    await userEvent.type(
      getByLabelText(/Share any comments.../i),
      "Great feedback!"
    );
    await userEvent.type(
      getByLabelText(/...and your email!/i),
      "test@example.com"
    );

    userEvent.click(getByRole("button", { name: /Submit/i }));

    await waitFor(() => expect(getByRole("status")).toBeInTheDocument());
    expect(getByLabelText(/Share any comments.../i)).toHaveValue("");
    expect(getByLabelText(/...and your email!/i)).toHaveValue("");
    expect(getByLabelText(/hand-thumbs-up/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(
        getByRole("button", { name: /Share your feedback!/i })
      ).toBeInTheDocument()
    );
  });

  it("should log an error message if sending the email fails", async () => {
    (sendEmailJS as jest.Mock).mockRejectedValue(
      new Error("Send email failed")
    );
    const { getByLabelText, getByRole } = render(<FeedbackForm />);
    await userEvent.click(
      getByRole("button", { name: /Share your feedback!/i })
    );
    await userEvent.click(getByLabelText(/hand-thumbs-up/i));
    await userEvent.type(
      getByLabelText(/Share any comments.../i),
      "Great feedback!"
    );
    await userEvent.type(
      getByLabelText(/...and your email!/i),
      "test@example.com"
    );

    userEvent.click(getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(getByRole("status")).toBeInTheDocument();
      expect(sendEmailJS).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith(
        "Failed to send feedback...",
        new Error("Send email failed")
      );
    });
  });
});
