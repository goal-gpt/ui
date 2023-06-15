import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import Main from "../pages/index";
import { renderWithClient } from "../src/utils";

describe("Main component", () => {
  let mockedUser: object;

  beforeEach(() => {
    (useSupabaseClient as jest.Mock).mockReturnValue({});
    (useUser as jest.Mock).mockReturnValue(null);
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    mockedUser = { name: "John Doe", id: 1 };
  });

  it("renders main areas", async () => {
    (useUser as jest.Mock).mockReturnValue(mockedUser);
    (useSupabaseClient as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        select: jest
          .fn()
          .mockResolvedValue({ data: [{ id: 1, text: "Hello" }], error: null }),
      }),
    });

    const { getByRole } = renderWithClient(<Main />);
    await waitFor(() => {
      expect(getByRole("form")).toBeInTheDocument();
    });
  });
});
