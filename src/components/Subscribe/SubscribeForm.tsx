import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { useState } from "react";

import type { Database } from "@/types/database";
import type { UpsertResponse } from "@/types/supabase";

export const SubscribeForm = () => {
  const [stage, setStage] = useState(0); // 0: name input, 1: location input
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const supabaseClient = useSupabaseClient<Database>();
  const user = useUser();
  const router = useRouter();

  const { mutate, isSuccess, isLoading, isError } = useMutation(
    ["subscribe"],
    async (e: FormEvent): Promise<UpsertResponse> => {
      e.preventDefault();

      if (!user || !user.email) {
        throw new Error("Please login to subscribe");
      }
      await supabaseClient
        .from("subscriber")
        .upsert({ email: user.email, user_id: user.id, is_subscribed: true })
        .throwOnError();

      return supabaseClient
        .from("profile")
        .upsert([
          { id: user.id, email: user.email, background: { name, location } },
        ])
        .throwOnError();
    },
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (stage === 0) {
      setStage(1);
    } else if (stage === 1) {
      setStage(2);
    }
  };

  if (!user) {
    return (
      <>
        <h3 className="mx-auto my-2 w-3/4 font-medium dark:text-slate-200">
          You need to login to receive a detailed plan.
        </h3>
        <button
          className="my-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() =>
            router.push({ pathname: "/login", query: { subscribe: true } })
          }
        >
          Go to login
        </button>
      </>
    );
  }

  if (isSuccess) {
    return (
      <p className="mx-auto my-2 w-3/4 text-green-500">
        Thank you for subscribing! You will receive your detailed plan within 24
        hours.
      </p>
    );
  }

  return (
    <form onSubmit={stage === 2 ? mutate : handleSubmit} className="mt-4">
      {stage === 0 && (
        <div>
          <h3 className="mx-auto mb-2 w-3/4 font-medium dark:text-slate-200">
            To receive your detailed plan, please share your name with us if
            you&apos;d like
          </h3>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mx-auto w-3/4 rounded border p-2"
          />
        </div>
      )}

      {stage === 1 && (
        <div>
          <h3 className="mx-auto mb-2 w-3/4 font-medium dark:text-slate-200">
            Thank you! To improve your plan quality, your location will be
            helpful in narrowing down our suggestions
          </h3>
          <input
            type="text"
            placeholder="Your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mx-auto w-3/4 rounded border p-2"
          />
        </div>
      )}
      {stage === 2 && (
        <div>
          <h3 className="mx-auto mb-2 w-3/4 font-medium dark:text-slate-200">
            Here are your details
          </h3>
          <p className="mx-auto mb-2 w-3/4 dark:text-slate-200">
            Name: {name || "Not provided"} <br />
            Location: {location || "Not provided"}
          </p>
        </div>
      )}
      {isLoading ? (
        <div className="text-slate-600 dark:text-slate-400">Loading</div>
      ) : (
        <button
          type="submit"
          className="my-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {stage < 2 ? "Next" : "Submit"}
        </button>
      )}
      {isError && (
        <p className="mt-2 text-red-500">
          Sorry, we received an error. Please try again.
        </p>
      )}
    </form>
  );
};
