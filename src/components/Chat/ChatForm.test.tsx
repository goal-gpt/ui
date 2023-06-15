import { act, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import { renderWithChatContext } from "../../utils";
import ChatForm from "./ChatForm";

const formPlaceholderText = /Refine your plan.../i;
describe("ChatForm", () => {
  let mockPush: jest.Mock;
  let mockSendMessage: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockSendMessage = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { getByPlaceholderText } = renderWithChatContext(<ChatForm />);

    expect(getByPlaceholderText(formPlaceholderText)).toBeInTheDocument();
  });

  it("sends the message from the query prop", () => {
    const testQuery = "Test message from query";
    const { getByPlaceholderText } = renderWithChatContext(
      <ChatForm query={testQuery} />,
      {
        sendMessage: mockSendMessage,
      }
    );
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith(testQuery);
    expect(getByPlaceholderText(formPlaceholderText)).toHaveValue("");
    expect(mockPush).toHaveBeenCalledWith("/", undefined, {
      shallow: true,
    });
  });

  it("updates the URL after the component renders", async () => {
    act(() => {
      renderWithChatContext(<ChatForm />);
    });
    waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/", undefined, {
        shallow: true,
      });
    });
  });
});
