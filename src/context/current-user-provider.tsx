// src/context/current-user-provider.tsx
"use client";

import { CurrentUser } from "@/core/auth/current-user";
import { getCurrentUserClient } from "@/core/auth/current-user-client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CurrentUserContextType = {
    user: CurrentUser | null;
    loading: boolean;
    setUser: (user: CurrentUser | null) => void;
    refresh: () => Promise<void>;
};

const CurrentUserContext = createContext<CurrentUserContextType | null>(null);

export function CurrentUserProvider({
    children,
    initialUser,
}: {
    children: React.ReactNode;
    initialUser?: CurrentUser | null;
}) {
    const [user, setUser] = useState<CurrentUser | null>(initialUser ?? null);
    const [loading, setLoading] = useState<boolean>(!initialUser);

    useEffect(() => {
        if (initialUser) return;
        let cancelled = false;
        (async () => {
            setLoading(true);
            const u = await getCurrentUserClient();
            if (!cancelled) {
                setUser(u);
                setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [initialUser]);

    const refresh = async () => {
        setLoading(true);
        const u = await getCurrentUserClient();
        setUser(u);
        setLoading(false);
    };

    const value = useMemo(
        () => ({ user, loading, setUser, refresh }),
        [user, loading]
    );

    return (
        <CurrentUserContext.Provider value={value}>
            {children}
        </CurrentUserContext.Provider>
    );
}

export function useCurrentUser() {
    const ctx = useContext(CurrentUserContext);
    if (!ctx) throw new Error("useCurrentUser must be used within CurrentUserProvider");
    return ctx;
}