import { useFormContext } from "react-hook-form";
import Input from "../../Input";

export const PersonalInformation: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Enter Personal Information</h2>
      <p className="text-gray-600 mb-4">Tell Us About Yourself</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          error={errors.firstName && String(errors.firstName.message)}
          label="First Name"
          {...register("firstName")}
          type="text"
          placeholder="First Name"
          required
        />
        <Input
          error={errors.lastName && String(errors.lastName.message)}
          label="Last Name"
          {...register("lastName")}
          type="text"
          placeholder="Last Name"
          required
        />
        <Input
          error={errors.email && String(errors.email.message)}
          label="Email"
          {...register("email")}
          type="email"
          placeholder="Email"
          required
        />
      </div>

      <div className="mt-4">
        <Input
          error={errors.phone && String(errors.phone.message)}
          label="Phone Number"
          {...register("phone")}
          type="number"
          placeholder="Phone Number"
          required
        />
        <Input
          error={errors.password && String(errors.password.message)}
          label="Password"
          {...register("password")}
          required
          type="password"
        />
        <Input
          error={
            errors.confirmPassword && String(errors.confirmPassword.message)
          }
          label="Confirm Password"
          {...register("confirmPassword")}
          type="password"
          required
        />
      </div>
    </div>
  );
};
