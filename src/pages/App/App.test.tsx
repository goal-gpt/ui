import userEvent from "@testing-library/user-event";
import React from "react";

import {
  createMemoryRouter,
  render,
  RouterProvider,
  screen,
} from "../../utils/testHelpers";
import { routesConfig } from "../routes";
import App from "./App";

// const getById = queryByAttribute.bind(null, "id");

test("routes correctly and renders key pages", async () => {
  const user = userEvent.setup();

  const { getByRole, getByText } = render(<App />);

  // verify page content for default route
  const mainElement = getByRole("main");
  expect(mainElement).toBeInTheDocument();

  // verify page content for /profile route
  await user.click(getByText(/Profile/));
  const profileContent = getByText(/Your Progress/i, { selector: "h1" });
  expect(profileContent).toBeInTheDocument();

  // verify page content for /help route
  await user.click(getByText(/Help/));
  const helpContent = getByText(/Frequently Asked Questions/i);
  expect(helpContent).toBeInTheDocument();
});

test("renders error page when route is not found", () => {
  const badRoute = "/help/not-a-route";
  const router = createMemoryRouter(routesConfig, {
    initialEntries: [badRoute],
  });

  render(<RouterProvider router={router} />);

  // verify page content for default route
  const content = screen.getByText(/Sorry, an unexpected error has occurred/i);
  expect(content).toBeInTheDocument();
});
