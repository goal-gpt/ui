import { fireEvent, render, screen } from "@testing-library/react";
import React, { useContext } from "react";

// import { ChatHook, useChat } from "../../hooks/useChat";
import { ChatContext } from "../Chat";
import { Plan } from "./Plan";
import { ChatHook } from "../../hooks/useChat";

// jest.mock("react", () => {
//   const originalReact = jest.requireActual("react");
//   return {
//     ...originalReact,
//     useContext: jest.fn().mockImplementation((context) => {
//       console.log(context);
//       if (context === ChatContext) {
//         return {
//           currentPlan: { goal: "", steps: [] },
//         };
//       }
//       return originalReact.useContext(context);
//     }),
//   };
// });
// jest.mock("../../hooks/useChat", () => ({
//   useChat: jest.fn(),
// }));
// jest.mock("../Chat", () => ({
//   ChatContext: {
//     Consumer: ({ children }) => children(),
//   },
// }));

describe("Plan", () => {
  // let mockContext;
  // let mockPlan;
  // beforeEach(() => {
  //   // (useContext as jest.Mock).mockReturnValue({
  //   //   currentPlan: {
  //   //     goal: "",
  //   //     steps: [],
  //   //   },
  //   // });
  //   mockPlan = {
  //     goal: "",
  //     steps: [],
  //   };
  //   mockContext = { currentPlan: mockPlan };
  // });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <ChatContext.Provider value={null}>
        <Plan />
      </ChatContext.Provider>
    );
  });

  // it("does not render if currentPlan is null", () => {
  //   (useContext as jest.Mock).mockReturnValue({
  //     currentPlan: null,
  //   });
  //   render(<Plan />);
  //   const goal = screen.queryByText(/Your plan/i);
  //   expect(goal).not.toBeInTheDocument();
  // });

  // it("does not render if currentPlan has no goal and steps", () => {
  //   (useContext as jest.Mock).mockReturnValue({
  //     currentPlan: {
  //       goal: "",
  //       steps: [],
  //     },
  //   });
  //   render(<Plan />);
  //   const goal = screen.queryByText(/Your plan/i);
  //   expect(goal).not.toBeInTheDocument();
  // });

  it("renders the plan when currentPlan is not null", () => {
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
    const goal = getByText(/Test Goal/i);
    expect(goal).toBeInTheDocument();
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
