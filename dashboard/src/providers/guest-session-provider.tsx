"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { setGuestMode } from "@/lib/guest-mode";

interface GuestSessionContextValue {
  /** Whether the current session is in guest mode. */
  isGuest: boolean;
  /** Enter guest mode (sets module flag, syncs context). */
  enterGuestMode: () => void;
  /** Exit guest mode (clears flag, syncs context). */
  exitGuestMode: () => void;
}

const GuestSessionContext = createContext<GuestSessionContextValue>({
  isGuest: false,
  enterGuestMode: () => {},
  exitGuestMode: () => {},
});

export function GuestSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isGuest, setIsGuest] = useState(false);

  const enterGuestMode = useCallback(() => {
    setGuestMode(true);
    setIsGuest(true);
  }, []);

  const exitGuestMode = useCallback(() => {
    setGuestMode(false);
    setIsGuest(false);
  }, []);

  return (
    <GuestSessionContext.Provider
      value={{ isGuest, enterGuestMode, exitGuestMode }}
    >
      {children}
    </GuestSessionContext.Provider>
  );
}

export function useGuestSession(): GuestSessionContextValue {
  return useContext(GuestSessionContext);
}
