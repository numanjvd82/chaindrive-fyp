import Button from "@/components/Button";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { RentalWithImages } from "@/lib/types";

interface RenterActionButtonsProps {
  rental: RentalWithImages;
  isCancelRentalLoading: boolean;
  isCompleteRentalByRenterLoading: boolean;
  onCancelRental: () => void;
  onCompleteRental: () => void;
}

export const RenterActionButtons: React.FC<RenterActionButtonsProps> = ({
  rental,
  isCancelRentalLoading,
  isCompleteRentalByRenterLoading,
  onCancelRental,
  onCompleteRental,
}) => {
  const disabledCompleteRentalByRenter =
    rental.status !== "active" || rental.completedByRenter;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
      <div className="space-y-3">
        {rental.status === "pending" && (
          <Button
            variant="primary"
            onClick={onCancelRental}
            isLoading={isCancelRentalLoading}
            disabled={isCancelRentalLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <FaTimes className="w-4 h-4" />
              Cancel Rental
            </div>
          </Button>
        )}

        {!rental.completedByRenter && rental.status === "active" && (
          <Button
            isLoading={isCompleteRentalByRenterLoading}
            onClick={onCompleteRental}
            disabled={disabledCompleteRentalByRenter}
            variant="primary"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <FaCheckCircle className="w-4 h-4" />
              Complete Rental
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};
