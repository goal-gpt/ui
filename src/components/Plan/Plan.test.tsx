import React from "react";

import { Step } from "../../hooks/useChat";
import { renderWithChatContext } from "../../utils";
import { Plan } from "./Plan";

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
        steps: [] as Array<Step>,
      },
    });
    let steps = queryByText(/1/i);
    expect(steps).not.toBeInTheDocument();

    ({ queryByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "",
        steps: [] as Array<Step>,
      },
    }));
    steps = queryByText(/1/i);
    expect(steps).not.toBeInTheDocument();
  });

  it("renders the goal if currentPlan has no steps", () => {
    const { queryByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "Test goal",
        steps: [] as Array<Step>,
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
        steps: [
          {
            number: 1,
            action: {
              name: "Test action.",
              description: "Rest of action.",
              ideas: {},
            },
          },
        ],
      },
    });
    const goal = getByText(/Test Goal/i);
    const step = getByText(/Test action./i);
    const description = getByText(/Rest of action./i);
    expect(goal).toBeInTheDocument();
    expect(step).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it("shows all the steps in the plan", () => {
    const { getByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "Test Goal",
        steps: [
          {
            number: 1,
            action: {
              name: "Test action 1.",
              description: "Rest of action 1.",
              ideas: {},
            },
          },
          {
            number: 2,
            action: {
              name: "Test action 2.",
              description: "Rest of action 2.",
              ideas: {},
            },
          },
        ],
      },
    });
    const step1 = getByText(/Test action 1./i);
    const description1 = getByText(/Rest of action 1./i);
    const step2 = getByText(/Test action 2./i);
    const description2 = getByText(/Rest of action 2./i);
    expect(step1).toBeInTheDocument();
    expect(description1).toBeInTheDocument();
    expect(step2).toBeInTheDocument();
    expect(description2).toBeInTheDocument();
  });
});
