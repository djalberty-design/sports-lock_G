import { useQuery } from "@tanstack/react-query";
import { getAccess, type AccessState } from "@/lib/desk-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function useAccess() {
  const { user, isPending } = useCurrentUserState();
  const q = useQuery({
    queryKey: ["access", user?.id],
    queryFn: () => getAccess(),
    enabled: Boolean(user),
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const unauthorized = Boolean(q.error && /unauthorized/i.test(String((q.error as Error).message ?? q.error)));
  const access: AccessState | null = q.data ?? null;
  return {
    user: unauthorized ? null : user,
    sessionPending: isPending,
    accessPending: Boolean(user) && !unauthorized && q.isPending,
    access,
    isAdmin: access?.status === "approved" && access.role === "admin",
    isApproved: access?.status === "approved",
    refetch: q.refetch,
  };
}
