import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React from "react";

import { Button } from "../Button";
import { UserIndicator } from "../UserIndicator";

function LoginToggle() {
  const user = useUser();
  const router = useRouter();
  if (!user) {
    return (
      <Button height="none" width="none" onClick={() => router.push("/login")}>
        Login
      </Button>
    );
  }

  return <UserIndicator />;
}

export default LoginToggle;
