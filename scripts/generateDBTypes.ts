/* eslint @typescript-eslint/no-var-requires: "off" */

require("dotenv").config({ path: ".env.local" });
const { exec } = require("child_process");
const { parse } = require("url");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl) {
  console.error("Environment variable NEXT_PUBLIC_SUPABASE_URL is not defined");
  process.exit(1);
}

const parsedUrl = parse(supabaseUrl);
const projectId = parsedUrl.hostname?.split(".")[0];

const command = `npx supabase gen types typescript --project-id ${projectId} --schema public > src/types/database.ts`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
