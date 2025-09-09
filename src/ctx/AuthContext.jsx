import React from "react";
export const useAuth = () => ({ user: null, login: async () => {}, register: async () => {} });
export default function AuthProvider({ children }) {
  return <>{children}</>;
}
