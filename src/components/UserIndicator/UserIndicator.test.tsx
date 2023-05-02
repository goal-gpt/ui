import { useUser } from "@supabase/auth-helpers-react";
import { render, screen } from "@testing-library/react";
import React from "react";

import { UserIndicator } from "./UserIndicator";

jest.mock("@supabase/auth-helpers-react");

describe("UserIndicator", () => {
  it("displays the user email when the user is logged in", () => {
    (useUser as jest.Mock).mockReturnValue({ email: "test@example.com" });

    render(<UserIndicator />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("does not display email when the user is not logged in", () => {
    (useUser as jest.Mock).mockReturnValue(null);

    const { container } = render(<UserIndicator />);

    expect(container.firstChild).toBeNull();
  });
});
