import React from "react";
import { motion } from "motion/react";
import {
  FaWallet,
  FaCheck,
  FaExclamationTriangle,
  FaPlug,
  FaSync,
} from "react-icons/fa";
import Button from "@/components/Button";
import { useWallet } from "@/hooks/useWallet";
import { useStoreWallet } from "@/hooks/useStoreWallet";
import { toast } from "react-toastify";
import { User, Wallet } from "@/lib/types";

interface WalletManagementProps {
  user: User;
  wallet: Wallet | null;
  refetchWallet: () => void;
}

export const WalletManagement: React.FC<WalletManagementProps> = ({
  user,
  wallet,
  refetchWallet,
}) => {
  const { account, connectWallet, provider, signer } = useWallet();
  const { storeWallet, isLoadingStoreWallet } = useStoreWallet();

  const handleAddWallet = async () => {
    if (!signer || !provider) return;
    try {
      const address = await signer.getAddress();
      await storeWallet(address);
      toast.success(
        "Wallet address stored successfully! You can now use it for transactions."
      );
      refetchWallet();
    } catch {
      toast.error("Failed to store wallet address. Please try again.");
    }
  };

  const isWalletMatched = wallet?.walletAddress === account;
  const isConnected = !!(account && signer && provider);

  // Get header content based on user role and wallet status
  const getHeaderContent = () => {
    if (wallet) {
      return {
        title: "Payment Method",
        description: "Manage your connected wallet",
      };
    }

    if (user.role === "owner") {
      return {
        title: "Add Payment Method",
        description: "Connect your wallet to get started",
      };
    }

    return {
      title: "Wallet Connection",
      description: "Connect your wallet for transactions",
    };
  };

  // Render owner-specific wallet management UI
  const renderOwnerWalletUI = () => {
    if (wallet) {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Connected Wallet
              </h3>
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isWalletMatched
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isWalletMatched ? (
                  <>
                    <FaCheck className="text-xs" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <FaExclamationTriangle className="text-xs" />
                    <span>Mismatch</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Stored Address:</p>
                <p className="font-mono text-sm bg-white p-3 rounded-lg border break-all">
                  {wallet.walletAddress}
                </p>
              </div>

              {account && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Connected Address:
                  </p>
                  <p className="font-mono text-sm bg-white p-3 rounded-lg border break-all">
                    {account}
                  </p>
                </div>
              )}
            </div>

            {!isWalletMatched && wallet.walletAddress && account && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <FaExclamationTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Wallet Address Mismatch</p>
                    <p>
                      The stored wallet address doesn't match your currently
                      connected wallet. Please update your wallet address to
                      ensure transactions work properly.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {!isConnected && (
              <Button
                onClick={connectWallet}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <FaPlug className="text-sm" />
                <span>Connect Wallet</span>
              </Button>
            )}

            {isConnected && (
              <Button
                disabled={isLoadingStoreWallet || isWalletMatched}
                variant="primary"
                isLoading={isLoadingStoreWallet}
                onClick={handleAddWallet}
                className="flex items-center space-x-2"
              >
                <FaSync
                  className={`text-sm ${
                    isLoadingStoreWallet ? "animate-spin" : ""
                  }`}
                />
                <span>
                  {isWalletMatched
                    ? "Address Up to Date"
                    : "Update Wallet Address"}
                </span>
              </Button>
            )}
          </div>
        </div>
      );
    }

    // No wallet stored for owner
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <FaWallet className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Payment Method Added
              </h3>
              <p className="text-gray-600 mb-4">
                To rent a car or use our services, please add a payment method
                by connecting your wallet.
              </p>
              <p className="text-sm text-gray-500">
                Your wallet address will be used for secure blockchain
                transactions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            disabled={isConnected}
            onClick={connectWallet}
            variant="primary"
            className="flex items-center justify-center space-x-2"
          >
            <FaPlug className="text-sm" />
            <span>{account ? "Wallet Connected" : "Connect Wallet"}</span>
          </Button>

          <Button
            disabled={!isConnected || isLoadingStoreWallet}
            variant="primary"
            isLoading={isLoadingStoreWallet}
            onClick={handleAddWallet}
            className="flex items-center justify-center space-x-2"
          >
            <FaWallet className="text-sm" />
            <span>Store Wallet Address</span>
          </Button>
        </div>
      </div>
    );
  };

  // Render renter-specific wallet management UI
  const renderRenterWalletUI = () => {
    if (wallet) {
      // Renter has wallet stored (should not happen, but handle gracefully)
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Wallet Information
            </h3>
            <div>
              <p className="text-sm text-gray-600 mb-1">Connected Address:</p>
              <p className="font-mono text-sm bg-white p-3 rounded-lg border break-all">
                {account || "Not Connected"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {!isConnected && (
              <Button
                onClick={connectWallet}
                variant="primary"
                className="flex items-center justify-center space-x-2"
              >
                <FaPlug className="text-sm" />
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>
        </div>
      );
    }

    // No wallet stored for renter (normal case)
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <FaWallet className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {isConnected ? "Wallet Connected" : "Wallet Not Connected"}
              </h3>
              <p className="text-gray-600 mb-4">
                {isConnected
                  ? "You can now rent cars and make transactions."
                  : "To rent cars and make transactions, please connect your wallet."}
              </p>
              <p className="text-sm text-gray-500">
                Your wallet address will be used for secure blockchain
                transactions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            disabled={isConnected}
            onClick={connectWallet}
            variant="primary"
            className="flex items-center justify-center space-x-2"
          >
            <FaPlug className="text-sm" />
            <span>{account ? "Wallet Connected" : "Connect Wallet"}</span>
          </Button>
        </div>
      </div>
    );
  };

  const headerContent = getHeaderContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
    >
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
          <FaWallet className="text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {headerContent.title}
          </h2>
          <p className="text-gray-600">{headerContent.description}</p>
        </div>
      </div>

      {user.role === "owner" ? renderOwnerWalletUI() : renderRenterWalletUI()}
    </motion.div>
  );
};
