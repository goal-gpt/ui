import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import React from "react";

import { ChatContext } from "../components/Chat/ChatContext";
import { type ChatHook } from "../hooks/useChat";

export function simulateSwipeLeft(element: ChildNode) {
  fireEvent.mouseDown(element, { clientX: 0, clientY: 100 });

  // Simulate the movement of the swipe
  fireEvent.mouseMove(element, { clientX: -2000, clientY: 100 });

  // Simulate the end of the swipe
  fireEvent.mouseUp(element);
}

interface Props {
  children?: ReactNode;
}

export function createWrapper() {
  const queryClient = new QueryClient();
  return ({ children }: Props) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function renderWithClient(ui: ReactElement) {
  const client = new QueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
  return {
    ...result,
    rerender: (rerenderUi: ReactElement) =>
      rerender(
        <QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>,
      ),
  };
}

export function renderWithChatContext(
  ui: ReactElement,
  mockChat?: Partial<ChatHook>,
) {
  return render(
    <ChatContext.Provider value={(mockChat as ChatHook) || null}>
      {ui}
    </ChatContext.Provider>,
  );
}
