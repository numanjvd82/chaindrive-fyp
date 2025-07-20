import React, { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaExpand, FaImages } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";

interface ImageSliderProps {
  images: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  images, 
  autoPlay = false, 
  autoPlayInterval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<boolean[]>([]);

  useEffect(() => {
    setImageLoadErrors(new Array(images.length).fill(false));
  }, [images]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length, goToNext]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageError = (index: number) => {
    setImageLoadErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      if (event.key === 'ArrowLeft') goToPrevious();
      if (event.key === 'ArrowRight') goToNext();
      if (event.key === 'Escape') setIsFullscreen(false);
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, goToNext, goToPrevious]);

  if (images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaImages className="text-gray-500 text-2xl" />
          </div>
          <p className="text-gray-500 font-medium">No images available</p>
          <p className="text-gray-400 text-sm mt-1">Images will appear here when uploaded</p>
        </div>
      </div>
    );
  }

  const ImageComponent = ({ image, index, className = "" }: { image: string, index: number, className?: string }) => (
    imageLoadErrors[index] ? (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <FaImages className="text-gray-400 text-4xl mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Failed to load image</p>
        </div>
      </div>
    ) : (
      <img
        src={`data:image/jpeg;base64,${image}`}
        alt={`Slide ${index + 1}`}
        className={className}
        onError={() => handleImageError(index)}
        loading="lazy"
      />
    )
  );

  return (
    <>
      {/* Main Slider */}
      <div className="relative w-full h-[400px] bg-gray-900 rounded-2xl overflow-hidden group">
        {/* Image Container */}
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <ImageComponent 
                image={images[currentIndex]} 
                index={currentIndex}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-lg" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
              aria-label="Next image"
            >
              <FaChevronRight className="text-lg" />
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="View fullscreen"
        >
          <FaExpand className="text-sm" />
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-white scale-125 shadow-lg" 
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={toggleFullscreen}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageComponent 
                image={images[currentIndex]} 
                index={currentIndex}
                className="max-w-full max-h-full object-contain rounded-lg"
              />

              {/* Fullscreen Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                  >
                    <FaChevronLeft className="text-xl" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                  >
                    <FaChevronRight className="text-xl" />
                  </button>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
              >
                ✕
              </button>

              {/* Fullscreen Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? "bg-white scale-125" 
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageSlider;
