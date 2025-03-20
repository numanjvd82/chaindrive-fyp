import { EthPriceDisplay } from "@/components/EthPriceDisplay";
import { CONTRACT_ADDRESS } from "@/constants";
import { useWallet } from "@/hooks/useWallet";
import { getContractInstance } from "@/lib/contract";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DummyContract = () => {
  const { signer, provider } = useWallet();
  const [balance, setBalance] = useState<string>("");
  const [sendAmount, setSendAmount] = useState<string>("");

  const getBalance = async () => {
    if (!provider || !signer) return;
    const balance = await provider.getBalance(signer.getAddress());
    setBalance(balance.toString());
  };

  useEffect(() => {
    getBalance();
  }, []);

  useEffect(() => {
    if (!signer || !provider) return;
    const contract = getContractInstance(signer);
    contract.on("FundsReceived", (sender, amount) => {
      console.log("Funds received:", sender, amount);
    });
    contract.on("FundsForwarded", (sender, amount) => {
      console.log("Funds forwarded:", sender, amount);
    });
  });

  const sendTransaction = async () => {
    if (!signer || !provider) return;

    try {
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: ethers.parseEther(sendAmount),
      });

      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);
    } catch (error: any) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Dummy Contract</h1>
      <EthPriceDisplay wei={balance} />

      <div>
        <h1>Send Amount</h1>
        <input
          className="w-1/2 p-2 border border-gray-300 rounded"
          type="number"
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
        />

        <button onClick={sendTransaction}>Send</button>
      </div>
    </div>
  );
};

export default DummyContract;
