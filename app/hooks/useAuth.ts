import React from "react";

interface Auth {
  loggedIn: boolean;
  loading: boolean;
  isAdmin: boolean;
}

export default function useAuth(): Auth {
  return { loggedIn: false, loading: false, isAdmin: false };
}
