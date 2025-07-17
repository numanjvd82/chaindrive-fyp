import React from "react";

const WhyChooseUs: React.FC = () => {
  const data = [
    {
      id: "1",
      image: "card1(whychooseus).svg",
      title: "Automated Smart Contracts",
      description:
        "Transparent rental agreements initiated and executed automatically, reducing disputes and ensuring trust.",
    },
    {
      id: "2",
      image: "card2(whychooseus).svg",
      title: "Flexible Payment Options",
      description: "Pay conveniently with Ethereum or Easypaisa.",
    },
    {
      id: "3",
      image: "card3(whychooseus).svg",
      title: "24-Hour Car Delivery",
      description:
        "Book your car anytime, and we will deliver it directly to you.",
    },
    {
      id: "4",
      image: "card4(whychooseus).svg",
      title: "24/7 Accessibility",
      description:
        "Always-on service so users can book or list vehicles anytime, anywhere.",
    },
  ];

  return (
    <div className="relative flex flex-col md:flex-row items-center bg-gray-100 p-6 md:p-12 gap-8">
      <div className="relative flex md:w-1/2 mt-8 md:mt-0 justify-center">
        <img
          className="absolute left-0 w-[90%] md:w-full h-auto object-contain z-0"
          loading="lazy"
          alt="Frame"
          src="carframe(whychooseus).svg"
        />
        <img
          className="relative w-[85%] md:w-full h-auto object-contain z-10"
          src="car(whychooseus).svg"
          alt="Car"
        />
      </div>

      <div className="text-center md:text-left md:w-1/2 space-y-8 z-10">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
          WHY CHOOSE US
        </h1>
        <p className="text-lg md:text-2xl text-gray-700">
          We offer the best experience with our rental deals
        </p>

        {data.map((item) => (
          <div key={item.id} className="flex items-center p-4 gap-4">
            <img
              className="w-16 h-16 md:w-20 md:h-20"
              src={item.image}
              alt={item.title}
            />
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {item.title}
              </h2>
              <p className="text-sm md:text-base text-gray-600 mt-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
