import { useUser } from "@supabase/auth-helpers-react";
import React from "react";

export function UserIndicator() {
  // TODO: expand this into its own navigation menu, with the profile picture in a circle etc
  const user = useUser();

  return <>{user && <div role="">{user?.email}</div>}</>;
}
