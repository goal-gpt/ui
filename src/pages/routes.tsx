import React from "react";

import { cardItemData } from "../services/cardItemData";
import { Login } from "./Auth";
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
    path: "/:category",
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
    element: <Profile cardItemData={cardItemData} />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
];
