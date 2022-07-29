import { createContext } from "react";

export const walletContext = createContext({
    account: "",
    setAccount: () => {},
    provider: "",
    setProvider: () => {}
  });