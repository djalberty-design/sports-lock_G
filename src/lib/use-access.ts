import { useQuery } from "@tanstack/react-query";
import { getAccess, type AccessState } from "@/lib/desk-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

const GUEST_ACCESS: AccessState = {
  status: "approved",
  role: "user",
  email: "",
  name: "",
  requestStatus: "none",
};

/**
 * v7: every visitor is approved. Admin only when a real signed-in
 * session is an approved admin. Guests skip getAccess (no 401).
 */
export function useAccess() {
  const { user, isPending } = useCurrentUserState();
  const signedIn = Boolean(user && !user.isDevFallback);
  const q = useQuery({
    queryKey: ["access", user?.id],
    queryFn: () => getAccess(),
    enabled: signedIn,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const access: AccessState = signedIn && q.data ? q.data : GUEST_ACCESS;
  return {
    user,
    sessionPending: isPending,
    accessPending: false,
    access,
    isAdmin: signedIn && access.status === "approved" && access.role === "admin",
    isApproved: true,
    refetch: q.refetch,
  };
}
