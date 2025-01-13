import { useFormContext } from "react-hook-form";
import RadioGroup from "../../RadioGroup";

export const RoleSelection: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">
        Get Started with ChainDrive!
      </h2>
      <p className="text-gray-600 mb-4">Choose Your Account Type to begin</p>
      <RadioGroup
        {...register("role")}
        name="role"
        options={[
          {
            value: "owner",
            label: "I am a car owner looking to rent out my vehicle.",
          },
          { value: "renter", label: "I am looking to rent a vehicle." },
        ]}
        error={errors.role && String(errors.role.message)}
      />
    </div>
  );
};
