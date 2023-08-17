import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Logout = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      supabaseClient.auth.signOut();
      router.push("/");
    }
  }, [user, router]);

  return null;
};

export default Logout;
