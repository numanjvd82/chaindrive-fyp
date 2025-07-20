import UserProfile from "@/components/UserProfile";
import { Listing, RentalWithImages } from "@/lib/types";
import { motion } from "motion/react";
import React, { useState } from "react";
import ViolationReportingModal from "./ViolationReportingModal";
import { useViolationByRentalId } from "@/hooks/useViolationById";
import { useRentalActions } from "./hooks/useRentalActions";
import { RentalHeader } from "./components/RentalHeader";
import { CompletionStatus } from "./components/CompletionStatus";
import { VehicleLocation } from "./components/VehicleLocation";
import { ViolationReports } from "./components/ViolationReports";
import { VehicleDetails } from "./components/VehicleDetails";
import { ActionButtons } from "./components/ActionButtons";
import { LateFeeDisplay } from "./components/LateFeeDisplay";

type Props = {
  rental: RentalWithImages;
  listing: Listing;
  refetchRentalDetail: () => void;
};

export const RentalDetailForOwner: React.FC<Props> = ({
  listing,
  rental,
  refetchRentalDetail,
}) => {
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const { refetchViolation, violation } = useViolationByRentalId(rental.id);

  const {
    handleConfirmRental,
    handleCancelRental,
    handleCompleteRentalByOwner,
    isConfirmRentalLoading,
    isCancelRentalLoading,
    isCompleteRentalByOwnerLoading,
  } = useRentalActions({ rental, refetchRentalDetail });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <RentalHeader status={rental.status} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CompletionStatus rental={rental} />

        {/* Show late fee if applicable */}
        <LateFeeDisplay rental={rental} />

        <VehicleLocation
          rentalStatus={rental.status}
          expectedDeviceId={listing.expectedDeviceId || ""}
          rentalId={rental.id}
        />

        <ViolationReports violation={violation} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <VehicleDetails listing={listing} rental={rental} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <UserProfile id={rental.renterId} title="Renter Information" />

            <ActionButtons
              rental={rental}
              violation={violation}
              isConfirmRentalLoading={isConfirmRentalLoading}
              isCancelRentalLoading={isCancelRentalLoading}
              isCompleteRentalByOwnerLoading={isCompleteRentalByOwnerLoading}
              onConfirmRental={handleConfirmRental}
              onCancelRental={handleCancelRental}
              onCompleteRental={handleCompleteRentalByOwner}
              onReportViolation={() => setIsViolationModalOpen(true)}
            />
          </motion.div>
        </div>

        <ViolationReportingModal
          isOpen={isViolationModalOpen}
          onClose={() => setIsViolationModalOpen(false)}
          rentalId={rental.id.toString()}
          onReportSubmitted={() => {
            refetchRentalDetail();
            refetchViolation();
          }}
        />
      </div>
    </div>
  );
};
