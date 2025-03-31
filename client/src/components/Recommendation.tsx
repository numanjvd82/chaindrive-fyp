const Recommendation = () => {
    const recommendations = [
        {
            id: 1,
            imageUrl: 'src/assets/images/car-3.png',
            name: 'Toyota Corolla GLI 2006',
            price: '120'
        },
        {
            id: 2,
            imageUrl: 'src/assets/images/car-1.png',
            name: 'Honda Civic 2018',
            price: '150'
        },
        {
            id: 3,
            imageUrl: 'src/assets/images/car-2.png',
            name: 'Suzuki Swift 2020',
            price: '130'
        }
    ];

    return (
        <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Recommended For You</h1>
        <div className="flex justify-start gap-6">
            {recommendations.map((item) => (
                <div key={item.id} className="w-48">
                    <div className="w-full h-32 flex items-center justify-center border rounded-lg shadow-xl p-4 bg-white">
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="rounded-lg max-h-full max-w-full object-contain"
                        />
                    </div>
                    <h3 className="text-sm font-semibold mt-4 line-clamp-2">{item.name}</h3>
                    <h4 className="text-sm font-medium text-slate-500 mt-1">{item.price}/day</h4>
                </div>
            ))}
        </div>
    </div>
    );
};

export default Recommendation;