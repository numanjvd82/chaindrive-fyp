import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import Button from "../../Button";
import Checkbox from "../../Checkbox"; // Import your Checkbox component
import Input from "../../Input";
import RadioGroup from "../../RadioGroup";
import { combinedSchema, FormData } from "./schemas";

const RoleSelection: React.FC = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const role = watch("role");
  console.log(role, errors);
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

const PersonalInformation: React.FC = () => {
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
        />
        <Input
          error={errors.lastName && String(errors.lastName.message)}
          label="Last Name"
          {...register("lastName")}
          type="text"
          placeholder="Last Name"
        />
        <Input
          error={errors.email && String(errors.email.message)}
          label="Email"
          {...register("email")}
          type="email"
          placeholder="Email"
        />
      </div>
    </div>
  );
};

const ReviewSection: React.FC = () => {
  const { watch } = useFormContext<FormData>();
  const data = watch();

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
            {data.firstName} {data.lastName} - {data.email}
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

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const methods = useForm<FormData>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      role: "renter",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await methods.trigger("role");
    } else if (step === 2) {
      isValid = await methods.trigger(["firstName", "lastName", "email"]);
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = (data: FormData) => {
    console.log("Submitted Data:", data);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6 max-w-lg w-full"
        >
          {step === 1 && <RoleSelection />}
          {step === 2 && <PersonalInformation />}
          {step === 3 && <ReviewSection />}
          <div className="flex justify-between">
            <div className="flex space-x-4">
              {step > 1 && (
                <Button text="Back" variant="secondary" onClick={prevStep} />
              )}
              {step < 3 && (
                <Button text="Continue" type="button" onClick={nextStep} />
              )}
            </div>
            {step === 3 && <Button text="Submit" type="submit" />}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default MultiStepForm;
