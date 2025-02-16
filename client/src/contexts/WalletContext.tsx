import { ethers } from "ethers";
import { createContext } from "react";

export const WalletContext = createContext<{
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connectWallet: () => Promise<void>;
}>({
  account: null,
  provider: null,
  signer: null,
  connectWallet: async () => {},
});
