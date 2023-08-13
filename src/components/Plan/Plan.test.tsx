import userEvent from "@testing-library/user-event";
import React from "react";

import edgeResponse from "../../../__tests__/__mocks__/functions.json";
import type { Step } from "../../hooks/useChat";
import { renderWithChatContext } from "../../utils";
import { Plan } from "./Plan";

describe("Plan", () => {
  const user = userEvent.setup();

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

  it("renders the full plan when currentPlan is not null", async () => {
    const { getByText, queryAllByText, getByRole } = renderWithChatContext(
      <Plan />,
      {
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
          links: ["[Example link](https://example.com)"],
        },
      },
    );
    const goal = getByText(/Test Goal/i);
    const step = getByText(/Test action\./i);
    expect(goal).toBeInTheDocument();
    expect(step).toBeInTheDocument();
    await user.click(getByRole("button", { name: /Step 1/i }));
    const description = getByText(/Rest of action\./i);
    const link = queryAllByText(/Example link/i);
    expect(description).toBeInTheDocument();
    expect(link.length).toBe(1);
  });

  it("shows all the steps in the plan", async () => {
    const { getAllByText, getAllByRole, getByRole, getByText } =
      renderWithChatContext(<Plan />, {
        currentPlan: {
          ...edgeResponse.sera.plan,
          links: edgeResponse.sera.links,
        },
      });
    await user.click(getByRole("button", { name: /Step 1/i }));
    await user.click(getByRole("button", { name: /Step 2/i }));
    await user.click(getByRole("button", { name: /Step 3/i }));
    await user.click(getByRole("button", { name: /Step 4/i }));
    await user.click(getByRole("button", { name: /Step 5/i }));

    const goal = getByText(edgeResponse.sera.plan.goal);
    const expectedStep = edgeResponse.sera.plan.steps[0] as Step;
    const step1 = getByText(expectedStep.action.name, {
      exact: false,
    });
    const description1 = getByText(expectedStep.action.description);
    const ideaHeaders = getAllByText(/✏️ Ideas/i);
    const idea1 = getByText(expectedStep.action.ideas.mostObvious as string);
    const idea2 = getByText(expectedStep.action.ideas.leastObvious as string);
    const idea3 = getByText(
      expectedStep.action.ideas.inventiveOrImaginative as string,
    );
    const idea4 = getByText(
      expectedStep.action.ideas.rewardingOrSustainable as string,
    );
    const linkHeader = getByText(/🔗 Our sources/i);
    const links = getAllByRole("link");
    expect(goal).toBeInTheDocument();
    expect(step1).toBeInTheDocument();
    expect(description1).toBeInTheDocument();
    expect(ideaHeaders.length).toBe(5);
    expect(idea1).toBeInTheDocument();
    expect(idea2).toBeInTheDocument();
    expect(idea3).toBeInTheDocument();
    expect(idea4).toBeInTheDocument();
    expect(linkHeader).toBeInTheDocument();
    expect(links.length).toBe(5);
    expect(links.at(-5)?.innerHTML).toMatch(
      /5 smart budgeting tips for first-time savers/i,
    );
    expect(links.at(-4)?.innerHTML).toMatch(
      /8 Ways To Budget During Inflation/i,
    );
    expect(links.at(-3)?.innerHTML).toMatch(/Household budgeting/i);
    expect(links.at(-2)?.innerHTML).toMatch(
      /How to Set Financial Goals for Your Future/i,
    );
    expect(links.at(-1)?.innerHTML).toMatch(/Systematic investing/i);
  });
});
