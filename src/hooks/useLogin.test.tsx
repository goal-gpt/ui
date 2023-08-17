import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import type { QueryStatus } from "./useChat";
import { useLogin } from "./useLogin";

jest.mock("@supabase/auth-helpers-react");
jest.mock("@tanstack/react-query");

// This module only tests that the hook calls the correct functions
// More sophisticated testing can be done on components that use this hook.
// See: https://www.js-howto.com/testing-react-query-with-jest-and-react-testing-library/
describe("useLogin", () => {
  const mockSendOtpMutation = {
    mutate: jest.fn(),
    status: "idle" as QueryStatus,
    error: null as Error | null,
  };

  beforeEach(() => {
    (useSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithOtp: jest.fn(),
      },
    });

    (useMutation as jest.Mock).mockReturnValue(mockSendOtpMutation);
  });

  it("should send OTP successfully", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.sendOtp({ email: "test@example.com", name: "Test User" });
    });

    await waitFor(() => {
      expect(mockSendOtpMutation.mutate).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "Test User",
      });
    });
  });
});
