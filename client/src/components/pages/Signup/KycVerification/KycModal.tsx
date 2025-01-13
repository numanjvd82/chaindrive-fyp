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
    getValues,
  } = useFormContext();

  console.log(getValues());

  const Footer = () => (
    <div className="flex justify-end space-x-4">
      <Button
        type="button"
        text="Cancel"
        variant="secondary"
        onClick={handleCancel}
      />
      <Button
        text="Confirm"
        type="button"
        variant="primary"
        onClick={handleConfirm} // Validate before closing
      />
    </div>
  );

  return (
    <DialogModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Confirmation"
      description="The kyc verification process is required to proceed with the registration."
      footer={<Footer />}
    >
      <div className="p-6 space-y-4">
        <FileInput
          error={errors.idCardFront && String(errors.idCardFront.message)}
          label="ID Card Front"
          fieldName="idCardFront"
          register={register}
          required
        />
      </div>
    </DialogModal>
  );
};

export default KycModal;
