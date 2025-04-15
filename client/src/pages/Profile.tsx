import Button from "@/components/Button";
import { AccountInfo } from "@/components/pages/Profile/AccountInfo";
import IdCardImages from "@/components/pages/Profile/IdCardImages";
import KycVerificationStatus from "@/components/pages/Profile/KycVerificationStatus";
import Splash from "@/components/Splash";
import { useListWallet } from "@/hooks/useListWallet";
import { useStoreWallet } from "@/hooks/useStoreWallet";
import { useUser } from "@/hooks/useUser";
import { useWallet } from "@/hooks/useWallet";

const ProfilePage: React.FC = () => {
  const { user, loading } = useUser();
  const { wallet, refetch } = useListWallet();
  const { account, connectWallet, provider, signer } = useWallet();
  const { storeWallet, isLoadingStoreWallet } = useStoreWallet();

  if (loading) {
    return <Splash />;
  }

  if (!user) {
    return null;
  }

  const handleAddWallet = async () => {
    if (!signer || !provider) return;
    try {
      const address = await signer.getAddress();

      await storeWallet(address);
      refetch();
    } finally {
      // Pass
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold">Profile</h1>
      <AccountInfo {...user} />
      <KycVerificationStatus />
      <IdCardImages
        idCardFront={user.idCardFront}
        idCardBack={user.idCardBack}
      />

      <div className="p-6 bg-accent rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-bold">Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="secondary">Edit Profile</Button>
          <Button variant="secondary">Change Password</Button>
        </div>
      </div>

      <div className="p-6 bg-accent rounded-lg shadow-md space-y-4">
        {wallet ? (
          <>
            <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
            <p className="text-gray-600">
              Your payment method is already added. You can update it if needed.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-800 font-mono text-sm">
                <strong>Wallet Address:</strong> {wallet.walletAddress}
              </p>
            </div>
            <Button
              disabled={!account || !signer || !provider}
              variant="primary"
              isLoading={isLoadingStoreWallet}
              onClick={async () => handleAddWallet()}
            >
              Update Wallet Address
            </Button>
            {!account || !signer || !provider ? (
              <Button onClick={connectWallet} variant="primary">
                Connect Wallet
              </Button>
            ) : null}
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800">
              Add Payment Method
            </h2>
            <p className="text-gray-600">
              To rent a car or use our services, please add a payment method.
            </p>
            <p className="text-gray-600">
              You can add a payment method using your wallet address. Please
              connect your wallet to proceed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                disabled={!!(account || signer || provider)}
                onClick={connectWallet}
                variant="primary"
              >
                {account ? "Wallet Connected" : "Connect Wallet"}
              </Button>
              <Button
                disabled={!account || !signer || !provider}
                variant="primary"
                isLoading={isLoadingStoreWallet}
                onClick={async () => handleAddWallet()}
              >
                Store Wallet Address
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
