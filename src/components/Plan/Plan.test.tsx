import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { Plan } from "./Plan";

jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useContext: jest.fn(),
  };
});

describe("Plan", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders without crashing", () => {
    render(<Plan />);
  });

  it("does not render if currentPlan is null", () => {
    (React.useContext as jest.Mock).mockReturnValue({
      currentPlan: null,
    });
    render(<Plan />);
    const goal = screen.queryByText(/Your plan/i);
    expect(goal).not.toBeInTheDocument();
  });

  it("does not render if currentPlan has no goal and steps", () => {
    (React.useContext as jest.Mock).mockReturnValue({
      currentPlan: {
        goal: "",
        steps: [],
      },
    });
    render(<Plan />);
    const goal = screen.queryByText(/Your plan/i);
    expect(goal).not.toBeInTheDocument();
  });

  it("renders the plan when currentPlan is not null", () => {
    (React.useContext as jest.Mock).mockReturnValue({
      currentPlan: {
        goal: "Test Goal",
        steps: [{ action: "Test action. Rest of action." }],
      },
    });
    render(<Plan />);
    const goal = screen.getByText(/Test Goal/i);
    expect(goal).toBeInTheDocument();
  });

  it("handles click on action to show the rest of the action", () => {
    (React.useContext as jest.Mock).mockReturnValue({
      currentPlan: {
        goal: "Test Goal",
        steps: [{ action: "Test action. Rest of action." }],
      },
    });
    render(<Plan />);
    const action = screen.getByText(/Test action./i);
    fireEvent.click(action);
    const restOfAction = screen.getByText(/Rest of action./i);
    expect(restOfAction).toBeInTheDocument();
  });
});
