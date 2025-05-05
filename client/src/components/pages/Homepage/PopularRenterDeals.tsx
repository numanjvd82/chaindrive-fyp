const PopularRenterDeals: React.FC = () => {
  const data = [
    {
      id: "1",
      image: "card1(prd).svg",
      title: "Jaguar XE L P250",
      ratingStar: "ratingstar.svg",
      rating: 4.8,
      reviews: "2,436",
      transformation: "auto",
      ac: "Air Conditioning",
      doors: 4,
      seats: "4",
      dailyPrice: "1,800",
    },
    {
      id: "2",
      image: "card2(prd).svg",
      title: "Audi R8",
      ratingStar: "ratingstar.svg",
      rating: 4.6,
      reviews: "2,436",
      transformation: "auto",
      ac: "Air Conditioning",
      doors: 2,
      seats: "2",
      dailyPrice: "2,100",
    },
    {
      id: "3",
      image: "card3(prd).svg",
      title: "BMW M3",
      ratingStar: "ratingstar.svg",
      rating: 4.8,
      reviews: "2,436",
      transformation: "auto",
      ac: "Air Conditioning",
      doors: 4,
      seats: "4",
      dailyPrice: "1,600",
    },
    {
      id: "4",
      image: "card4(prd).svg",
      title: "Lamborghini Huracan",
      ratingStar: "ratingstar.svg",
      rating: 4.8,
      reviews: "2,436",
      transformation: "auto",
      ac: "Air Conditioning",
      doors: 4,
      seats: "2",
      dailyPrice: "2,300",
    },
  ];

  return (
    <div className="my-36 items-center mb-52 px-4 md:px-12">
      <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800">
        POPULAR RENTER DEALS
      </h1>
      <p className="my-4 text-center text-lg md:text-2xl text-gray-600">
        Explore our top-rated rental deals
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        {data.map((e) => (
          <div key={e.id} className="card font-medium p-4 shadow-lg rounded-lg">
            <img
              className="h-32 md:h-40 w-full object-cover rounded-lg"
              src={e.image}
              alt={e.title}
            />
            <h1 className="mt-4 text-lg md:text-xl font-semibold text-gray-800">
              {e.title}
            </h1>
            <div className="flex items-center mt-2">
              <img className="h-4 md:h-5" src={e.ratingStar} alt="Rating" />
              <p className="ml-2 text-sm md:text-base text-gray-600">
                {e.rating} ({e.reviews} reviews)
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm md:text-base text-gray-600">
                ${e.dailyPrice} / day
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Rent Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularRenterDeals;
