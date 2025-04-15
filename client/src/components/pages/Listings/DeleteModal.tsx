import Button from "@/components/Button";
import DialogModal from "@/components/DialogModal";
import { useDeleteListing } from "@/hooks/useDeleteListing";
import { toast } from "react-toastify";

type Props = {
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  listingId: number | undefined;
  setListingId: React.Dispatch<React.SetStateAction<number | undefined>>;
  refetch: () => void;
};

export const DeleteModal: React.FC<Props> = ({
  showDeleteModal,
  setShowDeleteModal,
  listingId,
  setListingId,
  refetch,
}) => {
  const { deleteListing, isLoading } = useDeleteListing();
  const onClose = () => {
    setShowDeleteModal(false);
    setListingId(undefined);
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return toast.error("Invalid listing id");

    try {
      await deleteListing(id);
      refetch();
      onClose();
      toast.success("Listing deleted successfully");
    } catch {
      toast.error("Failed to delete listing ");
    }
  };

  return (
    <DialogModal
      title="Delete Listing"
      description="Are you sure you want to delete this listing?"
      isOpen={showDeleteModal}
      onClose={onClose}
      footer={
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={async () => handleDelete(listingId)}
            size="sm"
            type="button"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Yes, Delete
          </Button>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="secondary"
            size="sm"
            type="button"
          >
            Cancel
          </Button>
        </div>
      }
    />
  );
};
