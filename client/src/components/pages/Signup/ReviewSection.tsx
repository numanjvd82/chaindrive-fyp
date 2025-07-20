import { useFormContext } from "react-hook-form";
import Checkbox from "../../Checkbox";
import { FormValues } from "./schemas";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export const ReviewSection: React.FC = () => {
  const { getValues } = useFormContext<FormValues>();
  const data = getValues();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Review & Confirm</h2>
          <p className="text-gray-600 text-sm">Please review your information before submitting</p>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-blue-600" />
              
            </div>
            <span className="font-medium text-gray-900">Account Type</span>
          </div>
          <span className="text-gray-600 text-sm">{data.role === "owner" ? "Car Owner" : "Renter"}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-purple-600" />
              
            </div>
            <span className="font-medium text-gray-900">Name</span>
          </div>
          <span className="text-gray-600 text-sm">{data.firstName} {data.lastName}</span>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <MdEmail className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium text-gray-900">Email</span>
          </div>
          <span className="text-gray-600 text-sm">{data.email}</span>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-medium text-gray-900 mb-3">Terms & Conditions</h3>
        <div className="space-y-2">
          <Checkbox
            label="I agree to the Terms and Conditions"
            checked
            disabled
          />
          <Checkbox
            label="I agree to the Privacy Policy"
            checked
            disabled
          />
        </div>
      </div>
    </div>
  );
}
