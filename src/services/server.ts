import { rest } from "msw";
import { setupServer } from "msw/node";

import mockData from "../../__tests__/__mocks__/functions.json";
import { logger } from "../utils/logger";

let BASE_FUNCTION_URL = ""; // eslint-disable-line import/no-mutable-exports

switch (process.env.NEXT_PUBLIC_API_ENV) {
  case "mock":
    // eslint-disable-next-line
    const server = setupServer(
      rest.post("/sera", (_, res, ctx) => {
        return res(ctx.json(mockData.sera));
      }),
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
    logger.error("Invalid NEXT_PUBLIC_API_ENV");
}

const BEARER_TOKEN = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export { BASE_FUNCTION_URL, BEARER_TOKEN };
