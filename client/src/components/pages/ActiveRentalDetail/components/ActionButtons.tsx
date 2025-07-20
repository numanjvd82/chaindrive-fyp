import Button from "@/components/Button";
import {
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import { RentalWithImages } from "@/lib/types";

interface ActionButtonsProps {
  rental: RentalWithImages;
  violation: any;
  isConfirmRentalLoading: boolean;
  isCancelRentalLoading: boolean;
  isCompleteRentalByOwnerLoading: boolean;
  onConfirmRental: () => void;
  onCancelRental: () => void;
  onCompleteRental: () => void;
  onReportViolation: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  rental,
  violation,
  isConfirmRentalLoading,
  isCancelRentalLoading,
  isCompleteRentalByOwnerLoading,
  onConfirmRental,
  onCancelRental,
  onCompleteRental,
  onReportViolation,
}) => {
  const disabledCompleteRentalByOwner =
    rental.status !== "active" || rental.completedByOwner;

  const canReportViolation =
    (rental.status === "completed" ||
      (rental.completedByOwner && rental.completedByRenter)) &&
    !violation;

  const violationAlreadyReported =
    (rental.status === "completed" ||
      (rental.completedByOwner && rental.completedByRenter)) &&
    violation;

  const rentalNotCompleted =
    rental.status !== "completed" &&
    !(rental.completedByOwner && rental.completedByRenter);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
      <div className="space-y-3">
        {!rental.ownerConfirmed && rental.status === "pending" && (
          <Button
            variant="primary"
            onClick={onConfirmRental}
            isLoading={isConfirmRentalLoading}
            disabled={isConfirmRentalLoading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <FaCheckCircle className="w-4 h-4" />
              Accept Rental
            </div>
          </Button>
        )}

        {rental.status === "pending" && (
          <Button
            variant="secondary"
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

        {!rental.completedByOwner && rental.status === "active" && (
          <Button
            isLoading={isCompleteRentalByOwnerLoading}
            onClick={onCompleteRental}
            disabled={disabledCompleteRentalByOwner}
            variant="primary"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <FaCheckCircle className="w-4 h-4" />
              Complete Rental
            </div>
          </Button>
        )}

        {canReportViolation && (
          <Button
            onClick={onReportViolation}
            variant="secondary"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <FaExclamationTriangle className="w-4 h-4" />
              Report Violation
            </div>
          </Button>
        )}

        {violationAlreadyReported && (
          <div className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-xl text-center text-sm">
            <div className="flex items-center justify-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-green-600" />
              Violation already reported for this rental
            </div>
          </div>
        )}

        {rentalNotCompleted && (
          <div className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-xl text-center text-sm">
            <div className="flex items-center justify-center gap-2">
              <FaClock className="w-4 h-4" />
              Violations can only be reported after rental completion
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
