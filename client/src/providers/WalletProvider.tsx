import { WalletContext } from "@/contexts/WalletContext";
import useUser from "@/hooks/useUser";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const { user } = useUser();

  // Function to connect MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.warning(
        "MetaMask is not installed. Please install it to use this feature."
      );
      return;
    }

    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setProvider(web3Provider);
      setSigner(signer);

      toast.success("Connected to MetaMask!", {
        autoClose: 1500,
      });
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      toast.error("Error connecting to MetaMask. Please try again.");
    }
  };

  // Auto-connect on page load if already connected
  useEffect(() => {
    if (!user) return;
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });

      // Listen for account change
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setSigner(null);
          setProvider(null);
        }
      });

      // Listen for network change
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, [user]);

  return (
    <WalletContext.Provider
      value={{ account, provider, signer, connectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};
