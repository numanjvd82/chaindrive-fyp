import Input from "@/components/Input";
import Select from "@/components/Select";
import { useFormContext } from "react-hook-form";
import Button from "../../../Button";
import DialogModal from "../../../DialogModal";
import { FileInput } from "../../../FileInput";

interface KycModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
  handleConfirm?: () => void;
  handleCancel?: () => void;
}

const KycModal: React.FC<KycModalProps> = ({
  closeModal,
  handleCancel,
  handleConfirm,
  isOpen,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    getValues,
  } = useFormContext();

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      setError(fieldName, {
        message: "File is required.",
      });
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      setError(fieldName, {
        message: "File size should not exceed 2MB.",
      });
      return;
    }

    const VALID_TYPES = ["image/jpeg", "image/png"];
    if (!VALID_TYPES.includes(file.type)) {
      setError(fieldName, {
        message: "Invalid file type. Only JPEG and PNG are allowed.",
      });
      return;
    }

    clearErrors(fieldName);
    setValue(fieldName, file);
  };

  const Footer = () => (
    <div className="flex justify-end gap-3">
      <Button 
        type="button" 
        variant="secondary" 
        onClick={handleCancel}
        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200"
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="primary"
        onClick={() => {
          // Normalize file inputs
          const fileFields = ["idCardFront", "idCardBack", "selfie"];
          const files = fileFields.map((field) => {
            const value = getValues(field);
            return value instanceof FileList
              ? value.length > 0
                ? value[0]
                : null
              : value;
          });

          // Validate files
          const validated = files.map((file, i) => {
            const fieldName = fileFields[i];
            const errors: string[] = [];
            if (!file) {
              setError(fieldName, {
                message: "File is required.",
              });
              errors.push(fieldName);
            }
            return errors;
          });

          // Check for any validation errors
          const hasErrors = validated.some((errors) => errors.length > 0);
          if (hasErrors) return;
          handleConfirm?.();
        }}
        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        ✓ Confirm
      </Button>
    </div>
  );

  return (
    <DialogModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Identity Verification"
      description="Please upload your documents to complete the KYC verification process."
      footer={<Footer />}
    >
      <div className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FileInput
              error={errors.idCardFront && String(errors.idCardFront.message)}
              label="ID Card Front"
              fieldName="idCardFront"
              register={register}
              required
              onChange={(e) => handleFileInputChange(e, "idCardFront")}
            />
            <FileInput
              error={errors.idCardBack && String(errors.idCardBack.message)}
              label="ID Card Back"
              fieldName="idCardBack"
              register={register}
              required
              onChange={(e) => handleFileInputChange(e, "idCardBack")}
            />
            <FileInput
              error={errors.selfie && String(errors.selfie.message)}
              label="Selfie"
              fieldName="selfie"
              register={register}
              required
              onChange={(e) => handleFileInputChange(e, "selfie")}
            />
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              required
              label="Date of Birth"
              type="date"
              {...register("dob")}
              error={errors.dob && String(errors.dob.message)}
            />
            <Input
              required
              label="Address"
              type="text"
              {...register("address")}
              error={errors.address && String(errors.address.message)}
            />
            <Input
              label="City"
              type="text"
              {...register("city")}
              error={errors.city && String(errors.city.message)}
              required
            />
            <Select
              required
              label="State"
              options={[
                { value: "punjab", label: "Punjab" },
                { value: "sindh", label: "Sindh" },
                { value: "kpk", label: "KPK" },
                { value: "balochistan", label: "Balochistan" },
                { value: "gilgit", label: "Gilgit" },
                { value: "kashmir", label: "Kashmir" },
                { value: "islamabad", label: "Islamabad" },
              ]}
              optionLabel="Select State"
              {...register("state")}
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-1">Photo Guidelines</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Upload clear, well-lit photos</li>
                <li>• Ensure all text is readable</li>
                <li>• Use JPG or PNG format (max 2MB)</li>
                <li>• Avoid blurry or cropped images</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DialogModal>
  );
};

export default KycModal;
