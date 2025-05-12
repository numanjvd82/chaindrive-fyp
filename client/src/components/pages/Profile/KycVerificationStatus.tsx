type Props = {
  profileVerified: boolean;
};

const KycVerificationStatus: React.FC<Props> = ({ profileVerified }) => {
  const kycVerified = true;
  const kycFailReason = "ID Card is not clear";
  return (
    <div className="p-6 bg-accent rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Verification Status</h2>
      <div className="space-x-2">
        <p
          className={`mt-2 px-4 py-2 inline-block rounded-lg font-medium ${
            kycVerified
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {kycVerified ? "KYC Verified" : "KYC Not Verified"}
        </p>
        <p
          className={`mt-2 px-4 py-2 inline-block rounded-lg font-medium ${
            profileVerified
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {profileVerified ? "Profile Verified" : "Profile Not Verified"}
        </p>
      </div>
      {!kycVerified && (
        <p className="mt-2 text-gray-600">
          <strong>Reason:</strong> {kycFailReason}
        </p>
      )}
    </div>
  );
};

export default KycVerificationStatus;
