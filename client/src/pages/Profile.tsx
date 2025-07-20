import React from "react";
import { motion } from "motion/react";
import { FaUser } from "react-icons/fa";
import { AccountInfo } from "@/components/pages/Profile/AccountInfo";
import IdCardImages from "@/components/pages/Profile/IdCardImages";
import KycVerificationStatus from "@/components/pages/Profile/KycVerificationStatus";
import { WalletManagement } from "@/components/pages/Profile/WalletManagement";
import { ProfileActions } from "@/components/pages/Profile/ProfileActions";
import Splash from "@/components/Splash";
import { useListWallet } from "@/hooks/useListWallet";
import { useToggleTwoFactor } from "@/hooks/useToggleTwoFactor";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";

const ProfilePage: React.FC = () => {
  const { user, loading, fetchUser } = useUser();
  const { wallet, refetch } = useListWallet({
    id: user ? user.id : 0,
  });
  const { isToggleTwoFactorLoading, toggleTwoFactor } = useToggleTwoFactor();

  if (loading) {
    return <Splash />;
  }

  if (!user) {
    return null;
  }

  const handleToggleTwoFactor = async () => {
    try {
      await toggleTwoFactor({
        enabled: !user.twoFactorEnabled,
      });
      fetchUser();
      toast.success(
        `Two-factor authentication ${
          user.twoFactorEnabled ? "disabled" : "enabled"
        } successfully!`
      );
    } catch {
      toast.error(
        "Failed to toggle two-factor authentication. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg">
              <FaUser className="text-2xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your account settings and personal information
          </p>
        </motion.div>

        {/* Profile Sections */}
        <div className="space-y-8">
          <AccountInfo {...user} />
          <KycVerificationStatus profileVerified={user.isVerified} />
          <IdCardImages
            idCardFront={user.idCardFront}
            idCardBack={user.idCardBack}
          />
          <WalletManagement
            user={user}
            wallet={wallet || null}
            refetchWallet={refetch}
          />
          <ProfileActions
            user={user}
            isToggleTwoFactorLoading={isToggleTwoFactorLoading}
            onToggleTwoFactor={handleToggleTwoFactor}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
