import { useState } from "react";

interface IdCardImagesProps {
  idCardFront: string;
  idCardBack: string;
}

const IdCardImages: React.FC<IdCardImagesProps> = ({
  idCardBack,
  idCardFront,
}) => {
  const [showImages, setShowImages] = useState(false);

  return (
    <div className="p-6 bg-accent rounded-lg shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">ID Cards</h2>
        <button
          onClick={() => setShowImages(!showImages)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md shadow hover:bg-blue-500 focus:outline-none"
        >
          {showImages ? "Hide Images" : "Show Images"}
        </button>
      </div>
      {showImages && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-bold">ID Card (Front)</h3>
            <img
              src={`data:image/jpeg;base64,${idCardFront}`}
              alt="ID Card Front"
              className="w-full h-auto object-cover rounded-lg border"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold">ID Card (Back)</h3>
            <img
              src={`data:image/jpeg;base64,${idCardBack}`}
              alt="ID Card Back"
              className="w-full h-auto object-cover rounded-lg border"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IdCardImages;
