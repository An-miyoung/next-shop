import { useSession } from "next-auth/react";
import { SessionUserProfile } from "../types";

interface Auth {
  loggedIn: boolean;
  loading: boolean;
  isAdmin: boolean;
}

export default function useAuth(): Auth {
  const session = useSession();

  console.log(session);

  return {
    loggedIn: session.status === "authenticated",
    loading: session.status === "loading",
    isAdmin: false,
    // isAdmin: session.data?.user?.role === "admin",
  };
}
