import { useFormContext } from "react-hook-form";
import Checkbox from "../../Checkbox";
import { FormData } from "./schemas";

export const ReviewSection: React.FC = () => {
  const { getValues } = useFormContext<FormData>();
  const data = getValues();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Review and Confirm</h2>
      <p className="text-gray-600 mb-4">
        Please review your information before submitting.
      </p>
      <div className="space-y-4">
        <div>
          <h3 className="font-bold">Account Type</h3>
          <p>{data.role === "owner" ? "Host (Car Owner)" : "Renter"}</p>
        </div>
        <div>
          <h3 className="font-bold">Personal Information</h3>
          <p>
            {data.firstName} {data.lastName}
          </p>
        </div>
        <div>
          <h3 className="font-bold">Consent</h3>
          <Checkbox
            label="I agree to the Terms and Conditions"
            checked
            disabled
          />
          <Checkbox label="I agree to the Privacy Policy" checked disabled />
        </div>
      </div>
    </div>
  );
};
