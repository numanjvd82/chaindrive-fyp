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
  openModal,
  setIsOpen,
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
    <div className="flex justify-end space-x-4">
      <Button type="button" variant="secondary" onClick={handleCancel}>
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
      />
    </div>
  );

  return (
    <DialogModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Confirmation"
      description="The KYC verification process is required to proceed with the registration."
      footer={<Footer />}
    >
      <div className="p-6 space-y-4">
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

        <p className="text-sm text-gray-500">
          Please upload clear images of your ID card and a selfie for KYC
          verification.
        </p>
      </div>
    </DialogModal>
  );
};

export default KycModal;
