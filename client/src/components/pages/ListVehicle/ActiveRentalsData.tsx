import Input from "@/components/Input";
import React, { useState } from "react";

interface CardProps { children: React.ReactNode; className?: string; }
export const Card: React.FC<CardProps> = ({ children, className }) => <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>{children}</div>;

interface CardContentProps { children: React.ReactNode; }
export const CardContent: React.FC<CardContentProps> = ({ children }) => <div className="p-4">{children}</div>;

interface CardHeaderProps { children: React.ReactNode; }
export const CardHeader: React.FC<CardHeaderProps> = ({ children }) => <div className="border-b pb-2 mb-2">{children}</div>;

interface CardTitleProps { children: React.ReactNode; className?: string; }
export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;

interface Rental { renter: string; vehicle: string; duration: string; status: string; }

const rentals: Rental[] = [
  { renter: "Lauren B.", vehicle: "Honda Civic 2013", duration: "23 Nov - 15 Jan", status: "In progress" },
  { renter: "J.D Advert", vehicle: "Audi A4", duration: "23 Oct - 15 Nov", status: "End Rental" },
  { renter: "Lauren B.", vehicle: "Mercedes AMG G63", duration: "27 May - 15 June", status: "End Rental" },
];

const ActiveRentals: React.FC = () => {
  const [search, setSearch] = useState("");
  const filteredRentals = rentals.filter((rental) => rental.renter.toLowerCase().includes(search.toLowerCase()) || rental.vehicle.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card className="p-4 max-w-3xl mx-auto m-16">
      <CardHeader><CardTitle>Active Rentals</CardTitle></CardHeader>
      <CardContent>
        <Input placeholder="Search by renter, vehicle, or license number" className="mb-4" value={search} onChange={(e) => setSearch(e.target.value)} />
        <table className="w-full border-collapse text-left">
          <thead><tr className="border-b"><th className="p-2">Renter</th><th className="p-2">Vehicle</th><th className="p-2">Duration</th><th className="p-2">Status</th></tr></thead>
          <tbody>
            {filteredRentals.map((rental, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{rental.renter}</td><td className="p-2">{rental.vehicle}</td><td className="p-2">{rental.duration}</td><td className="p-2">{rental.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default ActiveRentals;