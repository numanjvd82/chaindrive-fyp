import React, { useState } from "react";

interface BookingSummary {
  label: string;
  value: string | number;
}

interface PaymentMethod {
  name: string;
  id: string;
}

const Payment: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const bookingSummary: BookingSummary[] = [
    { label: "Rental", value: "$222" },
    { label: "Deposit", value: "$500 (Refundable)" },
    { label: "Wheels fee", value: "$120 (Service fee)" },
    { label: "Payment", value: "$842 (You’ll pay later)" },
  ];

  const paymentMethods: PaymentMethod[] = [
    { name: "Easypaisa wallet", id: "easypaisa" },
    { name: "Ethereum wallet", id: "ethereum" },
  ];

  const handlePaymentMethodChange = (id: string) => {
    setSelectedPaymentMethod(id);
  };

  const handleConfirmPayment = () => {
    if (selectedPaymentMethod) {
      alert(`Payment confirmed with ${selectedPaymentMethod}`);
    } else {
      alert("Please select a payment method.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Pay & Get Your Ride!!</h1>

      {/* Booking Summary */}
      <div className="border-b pb-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Booking summary</h2>
        <ul>
          {bookingSummary.map((item, index) => (
            <li key={index} className="flex justify-between mb-2">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Methods */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Your payment method</h2>
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center mb-3">
            <input
              type="radio"
              id={method.id}
              name="paymentMethod"
              value={method.id}
              checked={selectedPaymentMethod === method.id}
              onChange={() => handlePaymentMethodChange(method.id)}
              className="mr-2"
            />
            <label htmlFor={method.id} className="flex items-center">
              {method.name}
            </label>
          </div>
        ))}

        <div className="text-center text-gray-500 my-2">OR</div>
      </div>

      {/* Confirm Payment Button */}
      <button
        onClick={handleConfirmPayment}
        className="bg-purple-600 text-white py-2 px-4 rounded w-full hover:bg-purple-700 transition"
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default Payment;
