import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import Button from './Button';
import Divider from './Divider';

interface VehicleOwnerProps {
    name: string;
    business: string;
    rating: number;
    reviewCount: number;
    country: string;
    memberSince: string;
    description: string;
}

const AboutVehicleOwner: React.FC<VehicleOwnerProps> = ({
    name,
    business,
    rating,
    reviewCount,
    country,
    memberSince,
    description,
}) => {
    // Function to render star ratings
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-500" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStar key={i} className="text-yellow-500" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-500" />);
            }
        }

        return stars;
    };

    return (
        <div className="max-w-md p-8 m-6 ">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">About Vehicle Owner</h1>
            <div className='flex'>
                <div className='mr-10'>
                    <img
                        src={`profilelogo.svg`}
                        alt="Selfie"
                        className="w-32 h-32 rounded-full object-cover border"
                    /></div>
                <div className="mb-6">
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">Ameer Hassan Khan</h2>
                        <p className="text-gray-600">Farooq Motors</p>
                    </div>
                    <div className="flex items-center my-2">
                        <div className="flex">
                            {renderStars()}
                        </div>
                        <span className="ml-2 text-gray-700">
                            {rating.toFixed(1)} ({reviewCount})
                        </span>
                    </div>
                    <Button> Contact me </Button>
                </div>

            </div>

            <div className="border pt-4 mb-6 rounded-sm shadow-sm border-gray-300">
                {/* Location and Member Since */}
                <div className='p-6'>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500">From</h3>
                        <p className="font-medium">Pakistan</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500">Member since</h3>
                        <p className="font-medium">Aug 2015</p>
                    </div>
                </div>

                <Divider />

                {/* Description */}
                <div className="mb-4">
                    <p className="text-gray-700">At Airbluesoft Premium Digital Studio we create all kinds of creative videos, specializing in Creating Promos( Website, Apps, Fashion, Real Estate, Youtube, NFT) and all other promos and all instructional videos.
                        <br></br> <br></br>
                        We Create Basic To High-End Videos.</p>
                </div>
                </div>
            </div>
        </div>
    );
};


export default AboutVehicleOwner;