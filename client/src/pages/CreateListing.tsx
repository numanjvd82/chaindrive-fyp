import { Form } from "@/components/pages/CreateListing/Form";
import React from "react";

const CreateListing: React.FC = () => {
  return (
    <div className="bg-gray-100 font-sans">
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold">Add New Vehicle</h2>
        <p className="text-sm mb-4 mt-2">
          Adding a new vehicle to your fleet is simple.
        </p>
        <Form />
      </div>
    </div>
  );
};

export default CreateListing;
