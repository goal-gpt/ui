import React from "react";

import edgeResponse from "../../../__tests__/__mocks__/functions.json";
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
    const { getAllByText, getAllByRole, getByText } = renderWithChatContext(
      <Plan />,
      {
        currentPlan: {
          ...edgeResponse.sera.plan,
          links: edgeResponse.sera.links,
        },
      }
    );

    const goal = getByText(edgeResponse.sera.plan.goal);
    const step1 = getByText(edgeResponse.sera.plan.steps[0].action.name, {
      exact: false,
    });
    const description1 = getByText(
      edgeResponse.sera.plan.steps[0].action.description
    );
    const ideaHeaders = getAllByText(/✏️ Ideas/i);
    const idea1 = getByText(
      edgeResponse.sera.plan.steps[0].action.ideas.mostObvious
    );
    const idea2 = getByText(
      edgeResponse.sera.plan.steps[0].action.ideas.leastObvious
    );
    const idea3 = getByText(
      edgeResponse.sera.plan.steps[0].action.ideas.inventiveOrImaginative
    );
    const idea4 = getByText(
      edgeResponse.sera.plan.steps[0].action.ideas.rewardingOrSustainable
    );
    const linkHeader = getByText(/🔗 Links/i);
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
    expect(links[0].innerHTML).toMatch(
      /5 smart budgeting tips for first-time savers/i
    );
    expect(links[1].innerHTML).toMatch(/8 Ways To Budget During Inflation/i);
    expect(links[2].innerHTML).toMatch(/Household budgeting/i);
    expect(links[3].innerHTML).toMatch(
      /How to Set Financial Goals for Your Future/i
    );
    expect(links[4].innerHTML).toMatch(/Systematic investing/i);
  });
});
