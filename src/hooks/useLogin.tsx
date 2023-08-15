import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

import { logger } from "@/utils";

import type { QueryStatus } from "./useChat";

type UserDetails = {
  email: string;
  name: string;
};

type LoginHook = {
  sendOtp: ({ email, name }: UserDetails) => void;
  status: QueryStatus;
  error: any;
};

export function useLogin(): LoginHook {
  const supabaseClient = useSupabaseClient();
  const sendOtpMutation = useMutation({
    mutationKey: ["sendOtp"],
    mutationFn: async ({ email, name }: UserDetails) => {
      return supabaseClient.auth.signInWithOtp({
        email,
        options: {
          data: { name },
          emailRedirectTo: window.location.origin,
        },
      });
    },
    onError: (error: Error) => {
      logger.error("Error sending OTP:", error);
    },
    onSuccess: (data) => {
      // Handle the success state, e.g., move to the next stage or close the form
      logger.info("OTP sent successfully:", data);
    },
  });

  const sendOtp = ({ email, name }: UserDetails) => {
    sendOtpMutation.mutate({ email, name });
  };

  return {
    sendOtp,
    status: sendOtpMutation.status as QueryStatus,
    error: sendOtpMutation.error,
  };
}
