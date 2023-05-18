import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render } from "@testing-library/react";
import React, { ReactNode } from "react";

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
  // ✅ creates a new QueryClient for each test
  const queryClient = new QueryClient();
  return ({ children }: Props) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function renderWithClient(client: QueryClient, ui: React.ReactElement) {
  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>
      ),
  };
}
