import { Session } from "@supabase/supabase-js";
import React, { render, screen } from "@testing-library/react";
import { MemoryRouter as Router, Navigate } from "react-router-dom";

import RequireAuth, { AuthContext, AuthContextValue } from "./RequireAuth";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    Navigate: jest.fn(),
  };
});

describe("RequireAuth", () => {
  function TestComponent() {
    return <div>Test Component</div>;
  }
  const renderRequireAuth = (session: Session | null) => {
    const value: AuthContextValue = { session };
    return render(
      <AuthContext.Provider value={value}>
        <Router>
          <RequireAuth>
            <TestComponent />
          </RequireAuth>
        </Router>
      </AuthContext.Provider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders children when session is not null", () => {
    const session = {} as Session; // Create a mock session object
    renderRequireAuth(session);
    expect(screen.getByText("Test Component")).toBeInTheDocument();
  });

  test("redirects to /login when session is null", () => {
    renderRequireAuth(null);
    expect((Navigate as jest.Mock).mock.calls[0][0].to).toEqual("/login");
  });
});
