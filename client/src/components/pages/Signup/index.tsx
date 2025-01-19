import { axiosInstance } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../Button";
import KycVerification from "./KycVerification";
import { PersonalInformation } from "./PersonalInfo";
import { ReviewSection } from "./ReviewSection";
import { RoleSelection } from "./RoleSelection";
import { combinedSchema, FormValues } from "./schemas";

const MAX_STEPS = 4;

const MultiStepForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const methods = useForm<FormValues>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      role: "renter",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      dob: "",
      idCardFront: undefined,
      idCardBack: undefined,
      selfie: undefined,
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await methods.trigger("role");
    } else if (step === 2) {
      isValid = await methods.trigger([
        "firstName",
        "lastName",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ]);
    } else if (step === 3) {
      isValid = await methods.trigger(["dob", "address", "city", "state"]);
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (form: FormValues) => {
    const formData = new FormData();
    // Append files
    formData.append("idCardFront", form.idCardFront);
    formData.append("idCardBack", form.idCardBack);
    formData.append("selfie", form.selfie);

    // Append other form fields
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "idCardFront" && key !== "idCardBack" && key !== "selfie") {
        formData.append(key, value as string);
      }
    });
    try {
      await axiosInstance.post("/api/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Signup successful");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <motion.div
      className="flex flex-col bg-white justify-center items-center h-screen overflow-auto "
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        background: "linear-gradient(to right, #3b82f6, #06b6d4, #3b82f6)",
        backgroundSize: "200% 200%",
      }}
    >
      <FormProvider {...methods}>
        <h1 className="text-3xl font-semibold mb-6">
          Signup (Step {step}/{MAX_STEPS})
        </h1>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6 max-w-lg w-full"
        >
          {step === 1 && <RoleSelection />}
          {step === 2 && <PersonalInformation />}
          {step === 3 && <KycVerification />}
          {step === 4 && <ReviewSection />}
          <div className="flex justify-between">
            <div className="flex space-x-4">
              {step > 1 && (
                <Button text="Back" variant="secondary" onClick={prevStep} />
              )}
              {step < MAX_STEPS && (
                <Button
                  text="Continue"
                  variant="primary"
                  type="button"
                  onClick={nextStep}
                />
              )}
            </div>
            {step === MAX_STEPS && (
              <Button
                disabled={methods.formState.isSubmitting}
                text="Submit"
                type="submit"
              />
            )}
          </div>
        </form>
      </FormProvider>
    </motion.div>
  );
};

export default MultiStepForm;
