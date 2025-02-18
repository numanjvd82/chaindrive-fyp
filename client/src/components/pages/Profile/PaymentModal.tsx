import Button from "@/components/Button";
import DialogModal from "@/components/DialogModal";
import Divider from "@/components/Divider";
import Input from "@/components/Input";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
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
  const { connectWallet, account } = useWallet();
  const [disabled, setDisabled] = useState(false);

  const handleConnectWallet = async () => {
    setDisabled(true);
    await connectWallet();
    setDisabled(false);
  };

  console.log(account);

  return (
    <DialogModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Add Payment Method"
      description="You can either connect your Metamask wallet or add your EasyPaisa number."
      footer={
        <div className="flex justify-end gap-4">
          <Button onClick={handleCancel} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="primary">
            Add
          </Button>
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

        {!account ? (
          <>
            <Divider />
            <div className="text-center">
              <Button
                onClick={async () => await handleConnectWallet()}
                disabled={disabled}
                variant="primary"
              >
                Connect Metamask Wallet
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center w-full">
            <Divider />
            <p className="text-gray-600 text-sm">
              <span>You're MetaMask Wallet is Connected:</span>
              <br />
              <b>{account}</b>
            </p>
          </div>
        )}
      </div>
    </DialogModal>
  );
};

export default PaymentModal;
