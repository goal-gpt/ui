import React from "react";

import { Error } from "./Error";
import { Help } from "./Help";
import { Main } from "./Main";
import { Profile } from "./Profile";

export const routesConfig = [
  {
    path: "/",
    element: <Main />,
    errorElement: <Error />,
  },
  {
    path: "/help",
    element: <Help />,
    errorElement: <Error />,
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <Error />,
  },
];
