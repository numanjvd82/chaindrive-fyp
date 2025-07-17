import Button from "@/components/Button";
import Loader from "@/components/Loader"; // Loader component
import { RentalDetailForOwner } from "@/components/pages/ActiveRentalDetail/RentalDetailForOwner";
import { RentalDetailForRenter } from "@/components/pages/ActiveRentalDetail/RentalDetailForRenter";
import useAuthUser from "@/hooks/useAuthUser";
import { useListingById } from "@/hooks/useListingById";
import { useRentalDetail } from "@/hooks/useRentalDetail";
import React from "react";
import { useParams } from "react-router-dom";

const ActiveRentalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthUser();

  const {
    rental,
    error: rentalDetailError,
    isLoading: isRentalDetailLoading,
    refetchRentalDetail,
  } = useRentalDetail(id);
  const {
    listing,
    error: listingError,
    isLoading: isListingLoading,
  } = useListingById(rental?.listingId || 0);

  if (isRentalDetailLoading || isListingLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );

  if (rentalDetailError || listingError)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">
            Unable to load rental details. Please try again later.
          </p>
          <Button
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );

  if (!rental || !listing || !id)
    return (
      <div className="flex items-center justify-center  h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            No Rental Found
          </h1>
          <p className="text-gray-600 mb-4">
            The rental you are looking for does not exist or has been removed.
          </p>
          <Button
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );

  if (!user) return null;

  return (
    <>
      {user.role === "owner" ? (
        <RentalDetailForOwner
          rental={rental}
          listing={listing}
          refetchRentalDetail={refetchRentalDetail}
        />
      ) : (
        <RentalDetailForRenter
          rental={rental}
          listing={listing}
          refetchRentalDetail={refetchRentalDetail}
        />
      )}
    </>
  );
};

export default ActiveRentalDetail;
