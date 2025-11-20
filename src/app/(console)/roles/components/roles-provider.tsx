// c:\Users\mdimr\OneDrive\Desktop\pcrm\src\app\(console)\roles\components\roles-provider.tsx
"use client";
import useDialogState from "@/hooks/use-dialog-state";
import React, { useState } from "react";
import { Role } from "@/core/db/client";

type RolesDialogType = "add" | "edit" | "delete";
type RolesContextType = {
    open: RolesDialogType | null;
    setOpen: (str: RolesDialogType | null) => void;
    currentRow: Role | null;
    setCurrentRow: React.Dispatch<React.SetStateAction<Role | null>>;
    refreshRoles?: () => void;
};
const RolesContext = React.createContext<RolesContextType | null>(null);
export function RolesProvider({ children, refreshRoles }: { children: React.ReactNode; refreshRoles?: () => void }) {
    const [open, setOpen] = useDialogState<RolesDialogType>(null);
    const [currentRow, setCurrentRow] = useState<Role | null>(null);
    return (
        <RolesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow, refreshRoles }}>
            {children}
        </RolesContext.Provider>
    );
}
export const useRoles = () => {
    const ctx = React.useContext(RolesContext);
    if (!ctx) throw new Error("useRoles has to be used within <RolesContext>");
    return ctx;
}