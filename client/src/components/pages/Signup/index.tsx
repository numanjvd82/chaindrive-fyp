import { axiosInstance } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import React, { useState, useEffect, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../Button";
import KycVerification from "./KycVerification";
import { PersonalInformation } from "./PersonalInfo";
import { ReviewSection } from "./ReviewSection";
import { RoleSelection } from "./RoleSelection";
import { combinedSchema, FormValues } from "./schemas";
import { FORM_STORAGE_KEY, loadFormData, saveFormData } from "@/lib/utils";

const MAX_STEPS = 4;

const MultiStepForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [initialData, setInitialData] = useState<Partial<FormValues>>({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadFormData(setStep);
    setInitialData(savedData);
    setIsDataLoaded(true);
  }, []);

  const methods = useForm<FormValues>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      role: initialData.role || "renter",
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
      city: initialData.city || "",
      state: initialData.state || "",
      dob: initialData.dob || "",
      idCardFront: undefined,
      idCardBack: undefined,
      selfie: undefined,
      password: initialData.password || "",
      confirmPassword: initialData.confirmPassword || "",
    },
    mode: "onTouched",
  });

  // Reset form with loaded data when data is loaded
  useEffect(() => {
    if (isDataLoaded) {
      methods.reset({
        role: initialData.role || "renter",
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        dob: initialData.dob || "",
        idCardFront: undefined,
        idCardBack: undefined,
        selfie: undefined,
        password: initialData.password || "",
        confirmPassword: initialData.confirmPassword || "",
      });
    }
  }, [isDataLoaded, initialData, methods]);

  const watch = methods.watch;
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Save form data whenever it changes
  useEffect(() => {
    if (!isDataLoaded) return;
    
    const subscription = methods.watch((data) => {
      saveFormData(data, step);
    });
    
    return () => subscription.unsubscribe();
  }, [isDataLoaded, methods, step]);

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await methods.trigger("role");
    } else if (step === 2) {
      isValid =
        (await methods.trigger([
          "firstName",
          "lastName",
          "email",
          "phone",
          "password",
          "confirmPassword",
        ])) && password === confirmPassword;

      // throw error if password and confirm password do not match
      if (!isValid) {
        toast.error("Password and Confirm Password do not match");
      }
    } else if (step === 3) {
      isValid = await methods.trigger(["dob", "address", "city", "state"]);
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // Don't render form until data is loaded
  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
      
      // Clear saved form data immediately on successful submission
      localStorage.removeItem(FORM_STORAGE_KEY);
      
      toast.success(
        "Account created successfully! You will be redirected to login page.",
        {
          onClose: () => {
            // Ensure localStorage is cleared and navigate
            localStorage.removeItem(FORM_STORAGE_KEY);
            navigate("/login");
          },
          autoClose: 3000,
        }
      );
      
      // Navigate after a short delay even if toast doesn't auto-close
      setTimeout(() => {
        navigate("/login");
      }, 3500);
      
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "An error occurred during signup");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      </div>
      
      <motion.div
        className="relative w-full max-w-2xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            Join ChainDrive
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Create your account to start your journey
          </p>
          
          {/* Progress Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm font-medium text-white">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step >= stepNumber 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'bg-white/20 text-purple-200'
                  }`}>
                    {step > stepNumber ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-12 h-1 mx-2 rounded transition-all duration-300 ${
                      step > stepNumber ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <FormProvider {...methods}>
          <motion.div
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden max-w-3xl  w-full mx-auto"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="p-8"
            >
              {/* Step Content */}
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                {step === 1 && <RoleSelection />}
                {step === 2 && <PersonalInformation />}
                {step === 3 && <KycVerification />}
                {step === 4 && <ReviewSection />}
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  {step > 1 && (
                    <Button 
                      variant="secondary" 
                      onClick={prevStep}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300"
                    >
                      ← Back
                    </Button>
                  )}
                  {step < MAX_STEPS && (
                    <Button 
                      variant="primary" 
                      type="button" 
                      onClick={nextStep}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Continue →
                    </Button>
                  )}
                </div>
                
                {step === MAX_STEPS && (
                  <Button 
                    disabled={methods.formState.isSubmitting} 
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    {methods.formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </div>
                    ) : (
                      '✨ Create Account'
                    )}
                  </Button>
                )}
              </div>

              {/* Step Indicator Text */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Step {step} of {MAX_STEPS}
                </p>
              </div>
            </form>
          </motion.div>
        </FormProvider>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-purple-200">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-white font-semibold hover:text-blue-300 transition-colors underline decoration-purple-400 hover:decoration-blue-300"
            >
              Sign in here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MultiStepForm;
