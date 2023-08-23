import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

import { logger } from "@/utils";

import type { QueryStatus } from "./useChat";

type UserDetails = {
  email: string;
  name?: string;
  subscribe?: boolean;
};

type LoginHook = {
  sendOtp: (obj: UserDetails) => void;
  status: QueryStatus;
  error: any;
};

export function useLogin(): LoginHook {
  const supabaseClient = useSupabaseClient();
  const sendOtpMutation = useMutation({
    mutationKey: ["sendOtp"],
    mutationFn: ({ email, name, subscribe }: UserDetails) => {
      const qs = subscribe ? "?isSubscribed=true" : "";
      return supabaseClient.auth.signInWithOtp({
        email,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/${qs}`,
        },
      });
    },
    onError: (error: Error) => {
      logger.error("Error sending OTP:", error);
    },
    onSuccess: (data) => {
      // Handle the success state, e.g., move to the next stage or close the form
      if (data.error) {
        throw new Error(data.error.message);
      }
      logger.info("OTP sent successfully:", data);
    },
  });

  const sendOtp = (obj: UserDetails) => {
    sendOtpMutation.mutate(obj);
  };

  return {
    sendOtp,
    status: sendOtpMutation.status as QueryStatus,
    error: sendOtpMutation.error,
  };
}
