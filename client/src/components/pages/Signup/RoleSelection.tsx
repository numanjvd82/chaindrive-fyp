import { useFormContext } from "react-hook-form";
import RadioGroup from "../../RadioGroup";

export const RoleSelection: React.FC = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const selectedRole = watch("role");

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome to ChainDrive!</h2>
      <p className="text-gray-600 mb-6 text-center">Choose your account type to get started with your car rental journey</p>
      <div className="space-y-4">
        <label className="block">
          <div className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${selectedRole === "owner" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}>
            <RadioGroup
              {...register("role")}
              name="role"
              options={[
                { value: "owner", label: "Car Owner" },
              ]}
              error={errors.role && String(errors.role.message)}
            />
            <p className="text-sm text-gray-500 mt-2 ml-7">I want to rent out my vehicle and earn money</p>
          </div>
        </label>
        <label className="block">
          <div className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${selectedRole === "renter" ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-white"}`}>
            <RadioGroup
              {...register("role")}
              name="role"
              options={[
                { value: "renter", label: "Car Renter" },
              ]}
              error={errors.role && String(errors.role.message)}
            />
            <p className="text-sm text-gray-500 mt-2 ml-7">I'm looking to rent a vehicle for my trips</p>
          </div>
        </label>
      </div>
    </div>
  );
};
