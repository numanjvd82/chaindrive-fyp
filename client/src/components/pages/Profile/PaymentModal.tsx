import Button from "@/components/Button";
import DialogModal from "@/components/DialogModal";
import Divider from "@/components/Divider";
import Input from "@/components/Input";
import { useFormContext } from "react-hook-form";

interface PaymentModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  closeModal: () => void;
  handleConfirm?: () => void;
  handleCancel?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  closeModal,
  isOpen,
  handleCancel,
  handleConfirm,
}) => {
  const { register } = useFormContext();
  return (
    <DialogModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Add Payment Method"
      description="You can either connect your Metamask wallet or add your EasyPaisa number."
      footer={
        <div className="flex justify-end gap-4">
          <Button text="Cancel" onClick={handleCancel} variant="secondary" />
          <Button text="Add" onClick={handleConfirm} variant="primary" />
        </div>
      }
    >
      <div className="flex flex-col items-center p-6 space-y-4">
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-600">
            EasyPaisa Number
          </label>
          <Input
            type="number"
            placeholder="Enter your EasyPaisa number"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            {...register("easypaisaNumber")}
          />
        </div>
        <Divider />
        <div className="text-center">
          <Button text="Connect Metamask Wallet" variant="primary" />
        </div>
      </div>
    </DialogModal>
  );
};

export default PaymentModal;
