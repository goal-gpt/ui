// FeedbackForm.test.tsx
import "@testing-library/jest-dom/extend-expect";

import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { renderWithRouter } from "../../utils/testHelpers";
import { FeedbackForm, FeedbackFormProps } from "./FeedbackForm";

describe("FeedbackForm", () => {
  const defaultProps: FeedbackFormProps = {
    quiz: "sampleQuiz",
  };

  it("should render the form correctly", () => {
    const { getByLabelText, getByText } = renderWithRouter(
      <FeedbackForm {...defaultProps} />
    );

    expect(
      getByLabelText("Share your feedback on this quiz")
    ).toBeInTheDocument();
    expect(getByText("Submit")).toBeInTheDocument();
  });

  it("handles user input", async () => {
    const { getByRole } = renderWithRouter(<FeedbackForm {...defaultProps} />);
    const input = getByRole("textbox");

    await userEvent.type(input, "This is my feedback");
    expect(input).toHaveValue("This is my feedback");
  });

  it("should toggle thumbs up and thumbs down correctly", () => {
    const { getByRole } = renderWithRouter(<FeedbackForm quiz="test" />);

    const thumbsUp = getByRole("button", { name: /hand-thumbs-up/i });
    const thumbsDown = getByRole("button", { name: /hand-thumbs-down/i });

    // Clicking thumbs up
    fireEvent.click(thumbsUp);
    const thumbsUpFill = getByRole("button", { name: /hand-thumbs-up-fill/i });
    expect(thumbsUpFill).toBeInTheDocument();
    expect(thumbsDown).toBeInTheDocument();

    // Clicking thumbs up fill (to unset it)
    fireEvent.click(thumbsUpFill);
    expect(
      getByRole("button", { name: /hand-thumbs-up/i })
    ).toBeInTheDocument();
    expect(thumbsUpFill).not.toBeInTheDocument();
    expect(thumbsDown).toBeInTheDocument();

    // Clicking thumbs down
    fireEvent.click(thumbsDown);
    const thumbsDownFill = getByRole("button", {
      name: /hand-thumbs-down-fill/i,
    });
    expect(
      getByRole("button", { name: /hand-thumbs-up/i })
    ).toBeInTheDocument();
    expect(thumbsDown).not.toBeInTheDocument();
    expect(thumbsDownFill).toBeInTheDocument();

    // Clicking thumbs down fill (to unset it)
    fireEvent.click(thumbsDownFill);
    expect(
      getByRole("button", { name: /hand-thumbs-up/i })
    ).toBeInTheDocument();
    expect(
      getByRole("button", { name: /hand-thumbs-down/i })
    ).toBeInTheDocument();
    expect(thumbsDownFill).not.toBeInTheDocument();
    expect(thumbsUpFill).not.toBeInTheDocument();
  });

  it("should allow submitting the form", async () => {
    const { getByLabelText, getByRole, getByText, queryByText } =
      renderWithRouter(<FeedbackForm quiz="test" />);

    const thumbsUp = getByRole("button", { name: /thumbs-up/i });
    const comments = getByLabelText("Share your feedback on this quiz");
    const submitButton = getByText("Submit");

    fireEvent.click(thumbsUp);
    userEvent.type(comments, "This is a test comment.");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(queryByText("This is a test comment.")).not.toBeInTheDocument();
    });
  });
});
