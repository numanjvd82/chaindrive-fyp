import React from "react";

const HowItWork: React.FC = () => {
  const data = [
    {
      id: "1",
      image: "location(howitwork).svg",
      title: "Choose Location",
      description: "Choose your and find your best car",
    },
    {
      id: "2",
      image: "pickupdate(howitwork).svg",
      title: "Pick-up date",
      description: "Select your pick up date and time to book your car",
    },
    {
      id: "3",
      image: "bookyourcar(howitwork).svg",
      title: "Book your car",
      description: "Book your car and we will deliver it directly to you",
    },
  ];

  return (
    <div className="my-36 items-center mb-52 px-4 md:px-12">
      <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800">
        HOW IT WORKS
      </h1>
      <p className="my-4 text-center text-lg md:text-2xl text-gray-600">
        Rent with the following 3 working steps
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {data.map((e) => (
          <div
            key={e.id}
            className="text-center items-center card font-medium p-4 shadow-lg rounded-lg"
          >
            <img className="mx-auto h-24 md:h-32" src={e.image} alt={e.title} />
            <h1 className="mt-4 text-lg md:text-xl font-semibold text-gray-800">
              {e.title}
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              {e.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWork;
