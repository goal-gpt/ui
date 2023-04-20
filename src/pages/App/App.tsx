import "./App.scss";

import { Session } from "@supabase/supabase-js";
import React, { useEffect, useMemo, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Cookie } from "../../components/Cookie";
import { supabase } from "../../services/supabase";
import { routesConfig } from "../routes";
import { AuthContext } from "./RequireAuth";

function Fallback() {
  return <div>Loading...</div>;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: newSession } }) => {
      setSession(newSession);
    });

    supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
  }, []);

  const router = createBrowserRouter(routesConfig);
  const contextValue = useMemo(() => ({ session }), [session]);

  return (
    <>
      <Cookie />
      <ToastContainer />
      <AuthContext.Provider value={contextValue}>
        <RouterProvider router={router} fallbackElement={<Fallback />} />
      </AuthContext.Provider>
    </>
  );
}

export default App;
