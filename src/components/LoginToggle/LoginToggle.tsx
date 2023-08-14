import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React from "react";

import { UserIndicator } from "../UserIndicator";

function LoginToggle() {
  const user = useUser();
  const router = useRouter();
  if (!user) {
    return <div onClick={() => router.push("/login")}>Sign in</div>;
  }

  return <UserIndicator />;
}

export { LoginToggle };
