import "@testing-library/jest-dom/extend-expect";

// import emailjs from "@emailjs/browser";
import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { logger, sendEmailJS } from "../../utils";
import { renderWithRouter } from "../../utils/testHelpers";
import { FeedbackForm, FeedbackFormProps } from "./FeedbackForm";

jest.mock("../../utils/email");
const emailjsMock = sendEmailJS as jest.MockedFunction<typeof sendEmailJS>;

jest.mock("../../utils/logger");
const loggerMock = logger.info as jest.MockedFunction<typeof logger.info>;

describe("FeedbackForm", () => {
  const defaultProps: FeedbackFormProps = {
    quiz: "sampleQuiz",
  };
  const OLD_ENV = process.env;

  beforeEach(() => {
    emailjsMock.mockReset();
    loggerMock.mockReset();
    jest.resetModules();
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
    jest.clearAllMocks();
  });

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

  it("should display a spinner while sending an email and clear the form on success", async () => {
    process.env.REACT_APP_EMAILJS_SERVICE_ID = "test_service";
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID = "test_template";
    process.env.REACT_APP_EMAILJS_USER_ID = "test_id";
    emailjsMock.mockResolvedValue({ status: 200, text: "OK" });

    const { getByRole, getByLabelText } = renderWithRouter(
      <FeedbackForm quiz="test" />
    );

    const commentsInput = getByLabelText(/share your feedback on this quiz/i);
    fireEvent.change(commentsInput, { target: { value: "Great quiz!" } });

    const submitButton = getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    expect(getByRole("status")).toBeInTheDocument();

    await waitFor(() => {
      expect(emailjsMock).toHaveBeenCalledTimes(1);
      expect(emailjsMock).toHaveBeenCalledWith({
        comments: "Great quiz!",
        quiz: "test",
        rating: "none",
      });
    });
    expect(loggerMock).toHaveBeenCalledWith("SUCCESS!", 200, "OK");
    await waitFor(() => expect(commentsInput).toHaveValue(""));
  });

  it("should log an error message if sending the email fails", async () => {
    const error = new Error("Send email failed");
    emailjsMock.mockRejectedValue(error);

    const { getByRole, getByLabelText } = renderWithRouter(
      <FeedbackForm quiz="test" />
    );

    const commentsInput = getByLabelText(/share your feedback on this quiz/i);
    fireEvent.change(commentsInput, { target: { value: "Great quiz!" } });

    const submitButton = getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(emailjsMock).toHaveBeenCalledTimes(1));
    expect(loggerMock).toHaveBeenCalledWith("FAILED...", error);
  });
});
