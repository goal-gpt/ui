import "./App.scss";

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { routesConfig } from "../routes";

function Fallback() {
  return <div>Loading...</div>;
}

function App() {
  const router = createBrowserRouter(routesConfig);
  return <RouterProvider router={router} fallbackElement={<Fallback />} />;
}

export default App;
