import { useState } from "react";
import Button from "../../../Button";
import KycModal from "./KycModal";

const KycVerification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleConfirm = async () => {
    console.log("Submitted");
    closeModal();
  };

  const handleCancel = () => {
    console.log("Cancelled");
    closeModal();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">KYC Verification</h2>
      <p className="text-gray-600 mb-4">Verify Your Identity</p>
      <div className="flex flex-col justify-center items-center">
        <p className="text-gray-600 mb-4">
          Upload a copy of your ID card (front and back) and a selfie
        </p>
        <Button onClick={openModal} variant="primary">
          Start KYC
        </Button>
        <KycModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          openModal={openModal}
          closeModal={closeModal}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default KycVerification;
