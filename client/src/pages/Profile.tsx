import Button from "@/components/Button";
import { AccountInfo } from "@/components/pages/Profile/AccountInfo";
import IdCardImages from "@/components/pages/Profile/IdCardImages";
import KycVerificationStatus from "@/components/pages/Profile/KycVerificationStatus";
import Splash from "@/components/Splash";
import useUser from "@/hooks/useUser";

const ProfilePage: React.FC = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <Splash />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold">Profile</h1>
      <AccountInfo {...user} />
      <KycVerificationStatus />
      <IdCardImages
        idCardFront={user.idCardFront}
        idCardBack={user.idCardBack}
      />

      {/* Action Buttons */}
      <div className="p-6 bg-accent rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-bold">Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button text="View Bookings" variant="primary" />
          <Button text="Edit Profile" variant="secondary" />
          <Button text="Change Password" variant="secondary" />
        </div>
      </div>

      {/* Add Payment Method Section */}
      <div className="p-6 bg-accent rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Add Payment Method</h2>
        <p className="text-gray-600 mt-2">
          To make transactions, please add a payment method.
        </p>
        <button className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-500 focus:outline-none">
          Add Payment
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
