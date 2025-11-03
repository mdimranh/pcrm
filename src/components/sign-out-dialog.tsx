"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { auth } = useAuthStore();

  const handleSignOut = () => {
    auth.reset();

    // Preserve current location for redirect after sign-in
    const currentPath = pathname + searchParams.toString();
    router.replace(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      destructive
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  );
}
