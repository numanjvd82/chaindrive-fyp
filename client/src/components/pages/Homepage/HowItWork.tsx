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
    <div className="my-36 items-center mb-52">
      <h1 className="text-dodgerblue-100 text-center bg-slate-300">
        HOW IT WORK
      </h1>
      <p className="my-4 text-center text-3xl">
        Rent with following 3 working steps
      </p>

      <div className="flex flex-wrap justify-center space-x-5 px-3 mt-2">
        {data.map((e, i) => {
          return (
            <div key={i}>
              <div className="text-center items-center card font-medium p-2 mt-6 ">
                <img
                  className="ml-12 h-32 md:h-32"
                  src={e.image}
                  alt={e.title}
                />
                <h1 className="mt-2 text-lg">{e.title}</h1>
                <h1 className="flex items-center mt-1 w-56">
                  <span className="text-gray-500 mr-1">{e.description}</span>
                </h1>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWork;
