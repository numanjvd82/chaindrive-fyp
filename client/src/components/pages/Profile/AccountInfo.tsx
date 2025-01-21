import { convertDateToString } from "@/lib/utils";

interface AccountInfoProps {
  selfie: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
  firstName,
  lastName,
  selfie,
  createdAt,
  updatedAt,
}) => {
  return (
    <div className="p-6 bg-accent rounded-lg shadow-md space-y-6">
      <div className="flex items-center space-x-6">
        {/* Selfie */}
        <img
          src={`data:image/jpeg;base64,${selfie}`}
          alt="Selfie"
          className="w-32 h-32 rounded-full object-cover border"
        />
        {/* Account Info */}
        <div>
          <h2 className="text-xl font-bold">{`${firstName} ${lastName}`}</h2>
          <p className="text-gray-600">
            <strong>Account Created:</strong> {convertDateToString(createdAt)}
          </p>
          <p className="text-gray-600">
            <strong>Last Updated:</strong> {convertDateToString(updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};
