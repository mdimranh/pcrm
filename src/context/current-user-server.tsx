// src/context/current-user-server.tsx
import { getCurrentUserServer } from "@/core/auth/current-user-server";
import { CurrentUserProvider } from "./current-user-provider";

export async function CurrentUserServerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUserServer();
    return <CurrentUserProvider initialUser={user}>{children}</CurrentUserProvider>;
}