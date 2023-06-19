import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { renderWithChatContext } from "../../utils";
import { Plan, processSentences, Step } from "./Plan";

describe("Plan", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderWithChatContext(<Plan />);
  });

  it("does not render if currentPlan has no goal", () => {
    let { queryByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "",
        steps: [] as Array<{ number: number; action: string }>,
      },
    });
    let steps = queryByText(/1/i);
    expect(steps).not.toBeInTheDocument();

    ({ queryByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "",
        steps: [] as Array<{ number: number; action: string }>,
      },
    }));
    steps = queryByText(/1/i);
    expect(steps).not.toBeInTheDocument();
  });

  it("renders the goal if currentPlan has no steps", () => {
    const { queryByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "Test goal",
        steps: [] as Array<{ number: number; action: string }>,
      },
    });
    const goal = queryByText(/Test goal/i);
    const steps = queryByText(/1/i);
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
    const goal = getByText(/Test Goal/i);
    const step = getByText(/Test action./i);
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

  const testCases = [
    {
      step: { action: "This is a single sentence." },
      expectedFirstSentence: "This is a single sentence.",
    },
    {
      step: {
        action: "This is the first sentence. This is the second sentence.",
      },
      expectedFirstSentence: "This is the first sentence.",
    },
    {
      step: { action: "Is this a question? Yes, it is!" },
      expectedFirstSentence: "Is this a question?",
    },
    {
      step: { action: "This sentence ends with an exclamation point!" },
      expectedFirstSentence: "This sentence ends with an exclamation point!",
    },
    {
      step: { action: "This sentence ends with a question mark?" },
      expectedFirstSentence: "This sentence ends with a question mark?",
    },
    {
      step: { action: "This sentence has no punctuation at the end" },
      expectedFirstSentence: "This sentence has no punctuation at the end",
    },
    {
      step: {
        action:
          "These sentences have no spaces after the punctuation.This is the second sentence.This is the third sentence.",
      },
      expectedFirstSentence:
        "These sentences have no spaces after the punctuation.",
    },
    {
      step: {
        action:
          "This is a sentence with etc.) in the middle. This is another sentence.",
      },
      expectedFirstSentence: "This is a sentence with etc.\\) in the middle.",
    },
    {
      step: {
        action:
          "This is a sentence with parentheses (like this). This is another sentence.",
      },
      expectedFirstSentence:
        "This is a sentence with parentheses \\(like this\\).",
    },
    {
      step: {
        action:
          "What about sentences with quotation marks? 'This is a quote.' This is another sentence.",
      },
      expectedFirstSentence: "What about sentences with quotation marks?",
    },
  ];

  testCases.forEach((testCase, index) => {
    it(`renders first sentence correctly for test case ${index}`, () => {
      // Mock the setExpanded function
      const setExpanded = jest.fn();
      const expanded = new Set<number>();

      // Render the Step component with the test step
      const { getByText } = render(
        <Step
          step={testCase.step}
          index={0}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      );

      // Check that the first sentence is rendered correctly
      expect(
        getByText(new RegExp(`Step 0: ${testCase.expectedFirstSentence}`))
      ).toBeTruthy();
    });
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
