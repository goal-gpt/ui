import { fireEvent, render } from "@testing-library/react";
import React, { ReactElement } from "react";

import { ChatHook } from "../../hooks/useChat";
import { ChatContext } from "../Chat";
import { Plan } from "./Plan";

const renderWithChatContext = (ui: ReactElement, currentPlan?: ChatHook) => {
  return render(
    <ChatContext.Provider value={currentPlan || null}>
      {ui}
    </ChatContext.Provider>
  );
};

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
    } as ChatHook);
    let plan = queryByText(planTitle);
    let steps = queryByText(/1/i);
    expect(plan).not.toBeInTheDocument();
    expect(steps).not.toBeInTheDocument();

    ({ queryByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        steps: [] as Array<{ number: number; action: string }>,
      },
    } as ChatHook));
    plan = queryByText(planTitle);
    steps = queryByText(/1/i);
    expect(plan).not.toBeInTheDocument();
    expect(steps).not.toBeInTheDocument();
  });

  it("renders the goal if currentPlan has no steps", () => {
    const { queryByText } = renderWithChatContext(<Plan />, {
      currentPlan: {
        goal: "Test goal",
      },
    } as ChatHook);
    const plan = queryByText(planTitle);
    const goal = queryByText(/Test goal/i);
    const steps = queryByText(/1/i);
    expect(plan).toBeInTheDocument();
    expect(goal).toBeInTheDocument();
    expect(steps).not.toBeInTheDocument();
  });

  it("renders the full plan when currentPlan is not null", () => {
    const { getByText } = render(
      <ChatContext.Provider
        value={
          {
            currentPlan: {
              goal: "Test Goal",
              steps: [{ number: 1, action: "Test action. Rest of action." }],
            },
          } as ChatHook
        }
      >
        <Plan />
      </ChatContext.Provider>
    );
    const plan = getByText(planTitle);
    const goal = getByText(/Test Goal/i);
    const step = getByText(/Test action./i);
    expect(plan).toBeInTheDocument();
    expect(goal).toBeInTheDocument();
    expect(step).toBeInTheDocument();
  });

  it("handles click on action to show the rest of the action", () => {
    const { getByText } = render(
      <ChatContext.Provider
        value={
          {
            currentPlan: {
              goal: "Test Goal",
              steps: [{ number: 1, action: "Test action. Rest of action." }],
            },
          } as ChatHook
        }
      >
        <Plan />
      </ChatContext.Provider>
    );
    const action = getByText(/Test action./i);
    fireEvent.click(action);
    const restOfAction = getByText(/Rest of action./i);
    expect(restOfAction).toBeInTheDocument();
  });
});
