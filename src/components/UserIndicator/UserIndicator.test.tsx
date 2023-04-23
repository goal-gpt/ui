import { Session } from "@supabase/supabase-js";
import React, { render, screen } from "@testing-library/react";

import { AuthContext } from "../../pages/Auth/RequireAuth";
import { UserIndicator } from "./UserIndicator";

describe("UserIndicator", () => {
  it("renders nothing when user is not logged in", () => {
    const mockAuthContextValue = { session: null };
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserIndicator />
      </AuthContext.Provider>
    );

    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });

  it("renders user email when user is logged in", () => {
    const mockSession: Session = {
      user: {
        email: "test@example.com",
      },
    } as Session;

    const mockAuthContextValue = { session: mockSession };
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserIndicator />
      </AuthContext.Provider>
    );

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});
