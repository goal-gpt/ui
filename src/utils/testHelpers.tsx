import { fireEvent } from "@testing-library/react";

export function simulateSwipeLeft(element: ChildNode) {
  fireEvent.mouseDown(element, { clientX: 0, clientY: 100 });

  // Simulate the movement of the swipe
  fireEvent.mouseMove(element, { clientX: -2000, clientY: 100 });

  // Simulate the end of the swipe
  fireEvent.mouseUp(element);
}
