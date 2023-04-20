import {
  AuthResponse as OriginalAuthResponse,
  SignInWithPasswordlessCredentials as OriginalSignInWithPasswordlessCredentials,
} from "@supabase/gotrue-js/src/lib/types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseAnonKey = process.env.REACT_APP_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export type SignInWithPasswordlessCredentials =
  OriginalSignInWithPasswordlessCredentials;
export type AuthResponse = OriginalAuthResponse;
