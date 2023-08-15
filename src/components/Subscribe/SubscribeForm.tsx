import type { FormEvent } from "react";
import { useState } from "react";

import { useLogin } from "@/hooks/useLogin";

export const SubscribeForm = ({ onClose }: { onClose: () => void }) => {
  const [stage, setStage] = useState(0); // 0: email input, 1: name input
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const { sendOtp, status, error } = useLogin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (stage === 0) {
      setStage(1);
    } else if (stage === 1) {
      sendOtp({ email, name });
      if (status !== "error") {
        onClose();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {stage === 0 && (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border p-2"
          />
        </div>
      )}

      {stage === 1 && (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border p-2"
          />
        </div>
      )}

      <button
        type="submit"
        className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {stage === 0 ? "Next" : "Submit"}
      </button>

      {error && <p className="mt-2 text-red-500">{error.message}</p>}
    </form>
  );
};
