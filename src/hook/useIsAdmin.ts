import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";

export function useIsAdmin() {
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";
  return isAdmin;
}
