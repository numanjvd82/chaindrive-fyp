import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaIdCard, FaEye, FaEyeSlash, FaExpand, FaTimes } from "react-icons/fa";

interface IdCardImagesProps {
  idCardFront: string;
  idCardBack: string;
}

const IdCardImages: React.FC<IdCardImagesProps> = ({
  idCardBack,
  idCardFront,
}) => {
  const [showImages, setShowImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white">
            <FaIdCard className="text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Identity Documents
            </h2>
            <p className="text-gray-600">Your uploaded ID card images</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowImages(!showImages)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          {showImages ? <FaEyeSlash /> : <FaEye />}
          <span>{showImages ? "Hide Images" : "Show Images"}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showImages && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Front ID Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    ID Card (Front)
                  </h3>
                  <button
                    onClick={() => setSelectedImage(idCardFront)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaExpand />
                  </button>
                </div>
                <img
                  src={`data:image/jpeg;base64,${idCardFront}`}
                  alt="ID Card Front"
                  className="w-full h-48 object-cover rounded-lg border shadow-md cursor-pointer"
                  onClick={() => setSelectedImage(idCardFront)}
                />
              </motion.div>

              {/* Back ID Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    ID Card (Back)
                  </h3>
                  <button
                    onClick={() => setSelectedImage(idCardBack)}
                    className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <FaExpand />
                  </button>
                </div>
                <img
                  src={`data:image/jpeg;base64,${idCardBack}`}
                  alt="ID Card Back"
                  className="w-full h-48 object-cover rounded-lg border shadow-md cursor-pointer"
                  onClick={() => setSelectedImage(idCardBack)}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`data:image/jpeg;base64,${selectedImage}`}
                alt="ID Card"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <FaTimes />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IdCardImages;
