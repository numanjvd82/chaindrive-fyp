import { useFormContext } from "react-hook-form";
import Input from "../../Input";
import { FaUser } from "react-icons/fa";

export const PersonalInformation: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FaUser className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Personal Information
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Tell us about yourself to get started
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
        <Input
          error={errors.phone && String(errors.phone.message)}
          label="Phone Number"
          {...register("phone")}
          type="tel"
          placeholder="Phone Number"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          error={errors.password && String(errors.password.message)}
          label="Password"
          {...register("password")}
          required
          type="password"
          placeholder="Password"
        />
        <Input
          error={
            errors.confirmPassword && String(errors.confirmPassword.message)
          }
          label="Confirm Password"
          {...register("confirmPassword")}
          type="password"
          required
          placeholder="Confirm Password"
        />
      </div>
    </div>
  );
};
