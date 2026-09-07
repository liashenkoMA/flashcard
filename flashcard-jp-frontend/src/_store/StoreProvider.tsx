"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { IAuthUser, IUserUsage } from "@/_interface/Interface";
import { AppStore, makeStore } from "./store";
import { setUsage, setUser } from "./authSlice";

export default function StoreProvider({
  children,
  initialUser,
  initialUsage,
}: {
  children: React.ReactNode;
  initialUser: IAuthUser | null;
  initialUsage: IUserUsage | null;
}) {
  const [store] = useState<AppStore>(() => {
    const newStore = makeStore();

    if (initialUser) {
      newStore.dispatch(setUser(initialUser));
    }

    if (initialUsage) {
      newStore.dispatch(setUsage(initialUsage));
    }

    return newStore;
  });

  return <Provider store={store}>{children}</Provider>;
}
