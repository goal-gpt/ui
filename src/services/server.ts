import { rest } from "msw";
import { setupServer } from "msw/node";

import mockData from "../../__tests__/__mocks__/functions.json";
import { toast } from "../utils";

let BASE_FUNCTION_URL = "";

switch (process.env.NEXT_PUBLIC_API_ENV) {
  case "mock":
    const server = setupServer(
      rest.post("/sera", (req, res, ctx) => {
        return res(ctx.json(mockData.sera));
      })
    );
    server.listen();
    break;
  case "local":
    BASE_FUNCTION_URL = "http://localhost:50321/functions/v1";
    break;
  case "prod":
    BASE_FUNCTION_URL =
      process.env.NEXT_PUBLIC_SUPABASE_EDGE_FUNCTION_URL || "";
    break;
  default:
    console.error("Invalid NEXT_PUBLIC_API_ENV");
    toast(
      "Sorry, there was an error connecting to our servers. Please try again later.",
      { type: "error" }
    );
}

const BEARER_TOKEN = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export { BASE_FUNCTION_URL, BEARER_TOKEN };
