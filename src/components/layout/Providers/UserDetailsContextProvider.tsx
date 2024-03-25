"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "@/hooks/useRouter";

interface UserDetailsContextType {
  user: User | null;
  signOut: () => void;
}

const UserDetailsContext = createContext<UserDetailsContextType>({
  user: null,
  signOut: () => {},
});

export const useUserDetails = () => useContext(UserDetailsContext);

interface UserDetailsContextProviderProps {
  children: ReactNode;
  user: User | null;
}

function UserDetailsContextProvider({
  children,
  user,
}: UserDetailsContextProviderProps) {
  // const posthog = usePostHog();
  const router = useRouter();
  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const value = {
    user,
    signOut,
  };

  return (
    <UserDetailsContext.Provider value={value}>
      {/* {user?.$id && <PushNotification />} */}
      {children}
    </UserDetailsContext.Provider>
  );
}

export default UserDetailsContextProvider;
