<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
>>>>>>> origin/numan

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

<<<<<<< HEAD
  // Ensure we only show 3 images (or fewer if less provided)
  const displayedImages = images.slice(0, 3);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayedImages.length - 1 : prevIndex - 1
=======
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
>>>>>>> origin/numan
    );
  };

  const goToNext = () => {
<<<<<<< HEAD
    setCurrentIndex((prevIndex) => 
      prevIndex === displayedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (displayedImages.length === 0) {
    return <div className="p-4 text-center">No images to display</div>;
  }

  return (
    <div className="relative w-96 h-72 rounded-lg shadow-lg">
      {/* Slider container */}
      <div className="relative h-64 md:h-72">
        {displayedImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
=======
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (images.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No images to display</div>
    );
  }

  return (
    <div className="relative w-full h-[350px] rounded-2xl shadow-lg overflow-hidden border border-gray-300">
      {/* Slider container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {images.map((image, index) => (
          <img
            key={index}
            src={`data:image/jpeg;base64,${image}`}
            alt={`Slide ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-all duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100 scale-105" : "opacity-0"
            }`}
          />
>>>>>>> origin/numan
        ))}
      </div>

      {/* Navigation buttons */}
<<<<<<< HEAD
      {displayedImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
=======
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black transition-all"
            aria-label="Previous image"
          >
            <FaChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black transition-all"
            aria-label="Next image"
          >
            <FaChevronRight className="h-6 w-6" />
>>>>>>> origin/numan
          </button>
        </>
      )}

      {/* Indicators */}
<<<<<<< HEAD
      {displayedImages.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {displayedImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
=======
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentIndex ? "bg-white scale-110" : "bg-white/50"
              }`}
>>>>>>> origin/numan
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default ImageSlider;
=======
export default ImageSlider;
>>>>>>> origin/numan
