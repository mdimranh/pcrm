"use client";

import { Users } from "@/app/api/users/route";
import useDialogState from "@/hooks/use-dialog-state";
import React, { useState } from "react";

type UsersDialogType = "invite" | "add" | "edit" | "approve" | "delete" | "suspend";

type UsersContextType = {
  open: UsersDialogType | null;
  setOpen: (str: UsersDialogType | null) => void;
  currentRow: Users | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Users | null>>;
  refreshUsers?: () => void;
};

const UsersContext = React.createContext<UsersContextType | null>(null);

export function UsersProvider({ children, refreshUsers }: { children: React.ReactNode; refreshUsers?: () => void }) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Users | null>(null);

  return (
    <UsersContext value={{ open, setOpen, currentRow, setCurrentRow, refreshUsers }}>
      {children}
    </UsersContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext);

  if (!usersContext) {
    throw new Error("useUsers has to be used within <UsersContext>");
  }

  return usersContext;
};
