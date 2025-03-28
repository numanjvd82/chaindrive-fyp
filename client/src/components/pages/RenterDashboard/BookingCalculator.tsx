import React, { useState } from 'react';
import Button from '@/components/Button'; 

interface BookingSummaryProps {
  ppd: number;
  onBookNow?: () => void;
}

const BookingCalculator: React.FC<BookingSummaryProps> = ({
  ppd = 45,
  onBookNow,
}) => {
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [totalDays, setTotalDays] = useState<number>(0);

  const calculateTotalDays = () => {
    if (checkInDate && checkOutDate) {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      
      // Ensure dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setTotalDays(0);
        return;
      }
      
      // Calculate the difference in milliseconds
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      
      // Convert to days
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTotalDays(diffDays);
    } else {
      setTotalDays(0);
    }
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white h-1/4 w-1/4">
      <div className='flex justify-between'>
        <h3 className="text-lg font-semibold mb-4">Booking dates</h3>
        <h3 className="text-lg mb-4">${ppd}/day</h3>
      </div>
      
      <div className="">
        <div className='bg-slate-100 my-2 rounded-lg shadow-sm p-2'>
          <p className="text-sm text-gray-500 bg-slate-100">Check-in</p>
          <input 
            type='date' 
            className='bg-slate-100 w-full'
            value={checkInDate}
            onChange={(e) => {
              setCheckInDate(e.target.value);
              calculateTotalDays();
            }}
          />
        </div>

        <div className='bg-slate-100 my-2 rounded-lg shadow-sm p-2'>
          <p className="text-sm text-gray-500 bg-slate-100">Check-out</p>
          <input 
            type='date' 
            className="bg-slate-100 w-full"
            value={checkOutDate}
            onChange={(e) => {
              setCheckOutDate(e.target.value);
              calculateTotalDays();
            }}
          />
        </div>

        {totalDays > 0 && (
          <div className='bg-slate-100 my-2 rounded-lg shadow-sm p-2'>
            <p className="text-sm text-gray-500">No of days: {totalDays}</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-2 mt-4">
        <p className="font-medium">Total</p>
        <p className="text-lg font-bold">${(ppd * totalDays).toFixed(2)}</p>
      </div>
      
      <Button 
        onClick={onBookNow}
        className="w-full py-2"
      >
        Initiate Booking
      </Button>
    </div>
  );
};

export default BookingCalculator;