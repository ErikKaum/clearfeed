import { createContext } from "react";

export const walletContext = createContext({
    account: undefined,
    setAccount: () => {},
    provider: undefined,
    setProvider: () => {}
  });

  export const LensTokenContext = createContext({
    accessToken: undefined,
    setAccessToken: () => {},
    refreshToken: undefined,
    setRefreshToken: () => {},
  });

  export const lensProfileContext = createContext({
    profile: undefined,
    setProfile: () => {},
  });