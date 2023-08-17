import { useUser } from "@supabase/auth-helpers-react";
import error from "next/error";
// import error from "next/error";
import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { useState } from "react";

export const SubscribeForm = () => {
  const [stage, setStage] = useState(0); // 0: name input, 1: location input
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  // const { sendOtp, error } = useLogin();
  const user = useUser();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (stage === 0) {
      setStage(1);
    } else if (stage === 1) {
      setStage(2);
      // sendOtp({ name, location });
    }
  };

  if (!user) {
    return (
      <>
        <p>You need to login to subscribe.</p>
        <button onClick={() => router.push(`/login`)}>Go to login</button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {stage === 0 && (
        <div>
          <input
            type="text"
            placeholder="Enter your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mx-auto w-3/4 rounded border p-2"
          />
        </div>
      )}

      {stage === 1 && (
        <div>
          <input
            type="text"
            placeholder="Enter your location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded border p-2"
          />
        </div>
      )}

      <button
        type="submit"
        className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {stage < 2 ? "Next" : "Submit"}
      </button>

      {error && <p className="mt-2 text-red-500">{error.name}</p>}
    </form>
  );
};
