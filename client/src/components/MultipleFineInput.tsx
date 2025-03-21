import { truncateText } from "@/lib/utils";
import { useState } from "react";
import { FieldValues, useFormContext, UseFormRegister } from "react-hook-form";
import { FaTimes, FaUpload } from "react-icons/fa";

interface MultiFileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register?: UseFormRegister<FieldValues> | undefined;
  fieldName: string;
  numOfUploads?: number;
}

export const MultiFileInput: React.FC<MultiFileInputProps> = ({
  error,
  label,
  register,
  onChange,
  fieldName,
  numOfUploads,
  ...props
}) => {
  const { setValue } = useFormContext();
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let selectedFiles = files;

    if (numOfUploads && files.length > numOfUploads) {
      selectedFiles = files.slice(0, numOfUploads);
    }

    if (selectedFiles.length > 0) {
      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      const newFileNames = selectedFiles.map((file) => truncateText(file.name));

      setPreviews(newPreviews);
      setFileNames(newFileNames);
      setValue(fieldName, selectedFiles);
    } else {
      resetFiles();
    }

    onChange?.(e);
  };

  const resetFiles = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);
    setFileNames([]);
    setValue(fieldName, null);
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={props.id}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label} {props.required && <span>*</span>}
        </label>
      )}
      <div
        className={`flex flex-wrap items-center w-full px-4 py-2 border rounded-lg ${
          error
            ? "border-red-500 text-red-500"
            : "border-gray-300 text-primary hover:border-primary hover:bg-gray-100"
        }`}
      >
        {previews.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {previews.map((preview, index) => (
              <div key={index} className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={preview}
                  alt="File Preview"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}
        <label
          htmlFor={props.id}
          className="flex-1 flex items-center justify-between cursor-pointer"
        >
          <span className="text-sm">
            {fileNames.length > 0 ? fileNames.join(", ") : "Select File(s)"}
          </span>
          {previews.length > 0 ? (
            <FaTimes
              className="text-lg text-red-500 cursor-pointer"
              onClick={resetFiles}
            />
          ) : (
            <FaUpload className="text-lg text-gray-500" />
          )}
          <input
            type="file"
            id={props.id}
            className="hidden"
            {...(register
              ? register(fieldName, { required: props.required })
              : {})}
            onChange={handleFileChange}
            multiple
            {...props}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
};
