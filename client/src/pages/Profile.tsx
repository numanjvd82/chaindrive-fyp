import Button from "@/components/Button";
import { AccountInfo } from "@/components/pages/Profile/AccountInfo";
import IdCardImages from "@/components/pages/Profile/IdCardImages";
import KycVerificationStatus from "@/components/pages/Profile/KycVerificationStatus";
import PaymentModal from "@/components/pages/Profile/PaymentModal";
import Splash from "@/components/Splash";
import useUser from "@/hooks/useUser";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const ProfilePage: React.FC = () => {
  const methods = useForm<any>();
  const { user, loading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleConfirm = async () => {
    console.log("Submitted");
    window.alert("Payment method added successfully!");
    closeModal();
  };

  const handleCancel = () => {
    console.log("Cancelled");
    closeModal();
  };

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
          <Button variant="primary">View Bookings</Button>
          <Button variant="secondary">Edit Profile</Button>
          <Button variant="secondary">Change Password</Button>
        </div>
      </div>

      {/* Add Payment Method Section */}
      <div className="p-6 bg-accent rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Add Payment Method</h2>
        <p className="text-gray-600 my-2">
          To make transactions, please add a payment method.
        </p>
        <Button onClick={openModal} variant="primary">
          Add Payment Method
        </Button>
      </div>

      <FormProvider {...methods}>
        <PaymentModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          closeModal={closeModal}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
        />
      </FormProvider>
    </div>
  );
};

export default ProfilePage;
