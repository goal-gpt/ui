import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../pages/Auth/RequireAuth";
import { Button } from "../Button";
import { UserIndicator } from "../UserIndicator";

function LoginToggle() {
  const { session } = useAuth();
  const navigate = useNavigate();
  if (!session) {
    return (
      <div>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    );
  }

  return <UserIndicator />;
}

export default LoginToggle;
