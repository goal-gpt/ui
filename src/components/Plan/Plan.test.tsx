import { fireEvent } from "@testing-library/react";
import React from "react";

import { renderWithChatContext } from "../../utils";
import { Plan, processSentences } from "./Plan";

const planTitle = /Your action plan/i;

describe("Plan", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderWithChatContext(<Plan />);
  });

  it("does not render if currentPlan is null", () => {
    const { queryByText } = renderWithChatContext(<Plan />);
    const plan = queryByText(planTitle);
    expect(plan).not.toBeInTheDocument();
  });

  it("does not render if currentPlan has no goal", () => {
    let { queryByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "",
        steps: [] as Array<{ number: number; action: string }>,
      },
    });
    let plan = queryByText(planTitle);
    let steps = queryByText(/1/i);
    expect(plan).not.toBeInTheDocument();
    expect(steps).not.toBeInTheDocument();

    ({ queryByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "",
        steps: [] as Array<{ number: number; action: string }>,
      },
    }));
    plan = queryByText(planTitle);
    steps = queryByText(/1/i);
    expect(plan).not.toBeInTheDocument();
    expect(steps).not.toBeInTheDocument();
  });

  it("renders the goal if currentPlan has no steps", () => {
    const { queryByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "Test goal",
        steps: [] as Array<{ number: number; action: string }>,
      },
    });
    const plan = queryByText(planTitle);
    const goal = queryByText(/Test goal/i);
    const steps = queryByText(/1/i);
    expect(plan).toBeInTheDocument();
    expect(goal).toBeInTheDocument();
    expect(steps).not.toBeInTheDocument();
  });

  it("renders the full plan when currentPlan is not null", () => {
    const { getByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "Test Goal",
        steps: [{ number: 1, action: "Test action. Rest of action." }],
      },
    });
    const plan = getByText(planTitle);
    const goal = getByText(/Test Goal/i);
    const step = getByText(/Test action./i);
    expect(plan).toBeInTheDocument();
    expect(goal).toBeInTheDocument();
    expect(step).toBeInTheDocument();
  });

  it("handles click on action to show the rest of the action", () => {
    const { getByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "Test Goal",
        steps: [{ number: 1, action: "Test action. Rest of action." }],
      },
    });
    const action = getByText(/Test action./i);
    fireEvent.click(action);
    const restOfAction = getByText(/Rest of action./i);
    expect(restOfAction).toBeInTheDocument();
  });
});

describe("processSentences function", () => {
  it("should return undefined for empty array", () => {
    expect(processSentences([])).toBeUndefined();
  });

  it("should return sentences as they are if they end with punctuation", () => {
    const sentences = ["Hello!", "How are you?"];
    expect(processSentences(sentences)).toBe("Hello! How are you?");
  });

  it("should add a period at the end of sentences that do not end with punctuation", () => {
    const sentences = ["Hello", "How are you"];
    expect(processSentences(sentences)).toBe("Hello. How are you.");
  });

  it("should handle a mix of sentences with and without ending punctuation", () => {
    const sentences = ["Hello!", "How are you"];
    expect(processSentences(sentences)).toBe("Hello! How are you.");
  });

  it("should handle empty strings correctly", () => {
    const sentences = ["Hello!", "", "How are you"];
    expect(processSentences(sentences)).toBe("Hello! How are you.");
  });
});
