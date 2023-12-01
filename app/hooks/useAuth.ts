import { useSession } from "next-auth/react";
import React from "react";

interface Auth {
  loggedIn: boolean;
  loading: boolean;
  isAdmin: boolean;
}

export default function useAuth(): Auth {
  const session = useSession();

  return {
    loggedIn: session.status === "authenticated",
    loading: session.status === "loading",
    isAdmin: false,
  };
}
