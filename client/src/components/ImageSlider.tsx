
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
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
        ))}
      </div>

      {/* Navigation buttons */}
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
          </button>
        </>
      )}

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentIndex ? "bg-white scale-110" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
