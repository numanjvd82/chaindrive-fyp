import activeRentalMock from "@/assets/images/active-rental-mock.png";
import ActiveRentalCard, { Rental } from "./ActiveRentalCard";

const rentals: Rental[] = [
  {
    id: 1,
    dates: "11/10/24 - 11/12/24",
    car: "2022 BMW M4",
    amount: 2100,
    image: activeRentalMock, // Replace with actual car image URL
  },
  {
    id: 2,
    dates: "11/01/24 - 11/04/24",
    car: "2021 Tesla Model S",
    amount: 1800,
    image: activeRentalMock,
  },
  {
    id: 3,
    dates: "10/25/24 - 10/31/24",
    car: "2019 Porsche 911",
    amount: 2300,
    image: activeRentalMock,
  },
];

const ActiveRentals = () => {
  return (
    <div className="mt-4 space-y-4">
      {rentals.map((rental) => (
        <ActiveRentalCard key={rental.id} {...rental} />
      ))}
    </div>
  );
};

export default ActiveRentals;
