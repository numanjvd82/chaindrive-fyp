import UserProfile from "@/components/UserProfile";
import { Listing, RentalWithImages } from "@/lib/types";
import { motion } from "motion/react";
import React from "react";
import { useViolationByRentalId } from "@/hooks/useViolationById";
import { useRenterActions } from "./hooks/useRenterActions";
import {
  RenterHeader,
  RenterCompletionStatus,
  ViolationReports,
  VehicleDetails,
  RenterActionButtons,
  LateFeeDisplay,
} from "./components";

type Props = {
  rental: RentalWithImages;
  listing: Listing;
  refetchRentalDetail: () => void;
};

export const RentalDetailForRenter: React.FC<Props> = ({
  listing,
  refetchRentalDetail,
  rental,
}) => {
  const { violation } = useViolationByRentalId(rental.id);

  const {
    handleCompleteRentalByRenter,
    handleCancelRental,
    isCompleteRentalByRenterLoading,
    isCancelRentalLoading,
  } = useRenterActions({ rental, refetchRentalDetail });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <RenterHeader status={rental.status} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RenterCompletionStatus rental={rental} />

        {/* Show late fee if applicable */}
        <LateFeeDisplay rental={rental} />

        {/* Show violation reports if any exist - renter can view but not create */}
        <ViolationReports violation={violation} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <VehicleDetails listing={listing} rental={rental} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <UserProfile id={listing.ownerId} title="Owner Information" />

            <RenterActionButtons
              rental={rental}
              isCancelRentalLoading={isCancelRentalLoading}
              isCompleteRentalByRenterLoading={isCompleteRentalByRenterLoading}
              onCancelRental={handleCancelRental}
              onCompleteRental={handleCompleteRentalByRenter}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
