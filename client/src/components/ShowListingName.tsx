import { useListings } from "@/hooks/useListings";
import React from "react";

type Props = {
  listingId: number;
};

const ShowListingName: React.FC<Props> = ({ listingId }) => {
  const { listings, isLoading } = useListings();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (!listings) {
    return <span>Listing not found</span>;
  }

  const listing = listings.find((listing) => listing.id === listingId);

  if (!listing) {
    return <span>Listing not found</span>;
  }

  return <span>{listing.title}</span>;
};

export default ShowListingName;
