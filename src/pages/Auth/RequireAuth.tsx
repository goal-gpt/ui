import { Session } from "@supabase/supabase-js";
import React, { createContext, ReactElement, useContext } from "react";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: ReactElement;
}

export default function RequireAuth({
  children,
}: RequireAuthProps): JSX.Element {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" />;
  }

  return children;
}

export interface AuthContextValue {
  session: Session | null;
}

export const AuthContext = createContext<AuthContextValue>({
  session: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};
