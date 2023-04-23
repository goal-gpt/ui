import "./UserIndicator.scss";

import React from "react";

import { useAuth } from "../../pages/Auth/RequireAuth";

export function UserIndicator() {
  // TODO: expand this into its own navigation menu, with the profile picture in a circle etc
  const { session } = useAuth();

  return <div>{session?.user?.email}</div>;
}
