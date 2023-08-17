import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import type { FormEvent } from "react";
import React, { useEffect, useState } from "react";

import { Logo } from "@/components/Logo/Logo";
import { useLogin } from "@/hooks/useLogin";

import styles from "./index.module.scss";

function Login({ isAuthChecking }: { isAuthChecking: boolean }) {
  // const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const router = useRouter();
  const user = useUser();
  const [email, setEmail] = useState<string>("");
  const { sendOtp, status } = useLogin(); // Use the useLogin hook

  // const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (!isAuthChecking && user) {
      router.push("/");
    }
  }, [user, isAuthChecking]);

  // const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setStatus("loading");
  //   // TODO: convert to use react-query
  //   const { error } = await supabaseClient.auth.signInWithOtp({
  //     email,
  //     options: { emailRedirectTo: window.location.origin },
  //   });
  //   if (error) {
  //     logger.error(error.message);
  //     toast(`${error.message}`, {
  //       type: TOAST_ERROR,
  //     });
  //     setStatus("idle");
  //   } else {
  //     toast("Check your email for the login link!", { type: TOAST_INFO });
  //     setStatus("success");
  //   }
  // };
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendOtp({ email });
  };

  return (
    <>
      <NextSeo title="personal finance companionship" />
      <div className="flex h-screen flex-col items-center justify-center dark:bg-slate-800">
        <div className="w-full max-w-screen-lg">
          <nav
            className="flex w-full flex-col items-center justify-center"
            role="navigation"
          >
            <Link href="/" className="my-4 self-center">
              <Logo xl />
            </Link>
          </nav>

          <div className="mt-4 text-center ">
            <h5 className="text-slate-800 dark:text-slate-200">
              Sign in to <b>eras</b> 🌅
            </h5>
            <h6 className="mt-4 text-slate-700 dark:text-slate-300">
              your personal finance guide
            </h6>
          </div>

          <div className="mt-4 flex w-full items-center justify-center">
            <div className="hidden w-1/4 md:block lg:block" />
            <div className="flex w-full flex-col items-center justify-center">
              <form onSubmit={handleLogin} className="w-1/2" role="form">
                <div className="mb-3 w-full">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="inputField w-full rounded border p-2"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded bg-blue-500 px-4 py-2 text-white"
                  disabled={status !== "idle"}
                >
                  {(status === "loading" && "Loading...") ||
                    (status === "idle" && "Get your login link") ||
                    (status === "error" && "Please try again") ||
                    "Check your email!"}
                </button>
              </form>
              <Link
                href="/"
                className={`mt-4 text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-300 ${styles.link}`}
              >
                <small>Or continue without signing in</small>
              </Link>
            </div>
            <div className="hidden w-1/4 md:block lg:block" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
