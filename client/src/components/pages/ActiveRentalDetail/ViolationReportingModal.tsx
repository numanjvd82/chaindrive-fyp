import React, { useState } from "react";
import Button from "@/components/Button";
import DialogModal from "@/components/DialogModal";
import { FaExclamationTriangle, FaFileUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCreateViolation } from "@/hooks/useCreateViolation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ViolationReportSchema } from "./schema";

export type FormValues = z.infer<typeof ViolationReportSchema>;

interface ViolationReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalId: string;
  onReportSubmitted: () => void;
}

export const ViolationReportingModal: React.FC<
  ViolationReportingModalProps
> = ({ isOpen, onClose, rentalId, onReportSubmitted }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createViolation } = useCreateViolation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(ViolationReportSchema),
    defaultValues: {
      violationType: "damage",
      detailedQuery: "",
      photos: [],
    },
    mode: "onChange",
  });

  const photos = watch("photos");
  const violationType = watch("violationType");

  const violationTypes: {
    value: FormValues["violationType"];
    label: string;
    color: string;
  }[] = [
    {
      value: "damage",
      label: "Vehicle Damage",
      color: "bg-red-500",
    },
    {
      value: "late_return",
      label: "Late Return",
      color: "bg-yellow-500",
    },
    {
      value: "illegal_activity",
      label: "Illegal Activity",
      color: "bg-purple-500",
    },
    {
      value: "speeding",
      label: "Speeding",
      color: "bg-orange-500",
    },
    {
      value: "unauthorized_location",
      label: "Unauthorized Location",
      color: "bg-blue-500",
    },
    { value: "other", label: "Other", color: "bg-gray-500" },
  ];

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Construct FormData following the same pattern as CreateListing
      const formData = new FormData();
      formData.append("rentalId", rentalId);
      formData.append("violationType", values.violationType);
      formData.append("detailedQuery", values.detailedQuery);

      // Append photos if any
      if (values.photos && values.photos.length > 0) {
        values.photos.forEach((photo) => {
          formData.append("photos", photo);
        });
      }

      // Submit violation report to database
      await createViolation(formData);

      toast.success("Violation report submitted successfully!");

      // Reset form
      reset();

      onReportSubmitted();
      onClose();
    } catch (error: unknown) {
      console.error("Error reporting violation:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit violation report."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setValue("photos", files);
  };

  if (!isOpen) return null;

  const footer = (
    <div className="flex gap-4">
      <Button
        type="button"
        variant="secondary"
        onClick={onClose}
        className="flex-1"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        className="flex-1 bg-red-600 hover:bg-red-700"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        form="violation-form"
      >
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </Button>
    </div>
  );

  return (
    <DialogModal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Violation"
      description={`Rental ID: ${rentalId}`}
      footer={footer}
    >
      {/* Form */}
      <form
        id="violation-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Violation Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Violation Type
          </label>
          <div className="grid grid-cols-1 gap-3">
            {violationTypes.map((type) => (
              <div
                key={type.value}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  violationType === type.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setValue("violationType", type.value)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${type.color}`} />
                  <span className="font-medium text-gray-900">
                    {type.label}
                  </span>
                </div>
                {violationType === type.value && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Expected Damage */}
        <div>
          <label
            htmlFor="expectedDamage"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Expected Damage (if applicable)
          </label>
          <textarea
            id="expectedDamage"
            {...register("expectedDamage")}
            placeholder="Describe the expected damage..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            required
          />
          {errors.expectedDamage && (
            <p className="text-red-500 text-sm mt-1">
              {errors.expectedDamage.message}
            </p>
          )}
        </div>

        {/* Violation Details */}
        <div>
          <label
            htmlFor="violationDetails"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Violation Details
          </label>
          <textarea
            id="violationDetails"
            {...register("detailedQuery")}
            placeholder="Describe the violation in detail..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            required
          />
          {errors.detailedQuery && (
            <p className="text-red-500 text-sm mt-1">
              {errors.detailedQuery.message}
            </p>
          )}
        </div>

        {/* Evidence Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evidence (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="evidence-upload"
            />
            <label htmlFor="evidence-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <FaFileUpload className="text-gray-400 text-2xl" />
                <p className="text-sm text-gray-600">
                  Click to upload photos or documents
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, PDF up to 10MB each
                </p>
              </div>
            </label>
          </div>
          {photos && photos.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {photos.length} file(s) selected
              </p>
            </div>
          )}
          {errors.photos && (
            <p className="text-red-500 text-sm mt-1">{errors.photos.message}</p>
          )}
        </div>

        {/* Terms Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-yellow-600 text-lg flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important Notice:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  This report will be recorded on the blockchain and cannot be
                  modified
                </li>
                <li>
                  False reporting may result in penalties under the rental terms
                </li>
                <li>The renter will be notified of this violation report</li>
                <li>
                  Penalty amounts will be automatically calculated and deducted
                  from security deposit
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </DialogModal>
  );
};

export default ViolationReportingModal;
