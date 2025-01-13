import React, { useState } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { FaTimes, FaUpload } from "react-icons/fa";
import { truncateFile } from "../lib/utils";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register: UseFormRegister<FieldValues>;
  fieldName: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  error,
  label,
  register,
  onChange,
  fieldName,
  ...props
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("Select File");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileName(truncateFile(file.name));
      if (preview) URL.revokeObjectURL(preview);
    } else {
      resetFile();
    }
  };

  const resetFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName("Select File");
    onChange?.({ target: { files: null } } as any);
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={props.id}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && <span>*</span>}
        </label>
      )}
      <div
        className={`flex items-center w-full px-4 py-2 border rounded-lg ${
          error
            ? "border-red-500 text-red-500"
            : "border-gray-300 text-primary hover:border-primary hover:bg-gray-100"
        }`}
      >
        {preview && (
          <div className="w-12 h-12 mr-3 flex-shrink-0">
            <img
              src={preview}
              alt="File Preview"
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
        <label
          htmlFor={props.id}
          className="flex-1 flex items-center justify-between cursor-pointer"
        >
          <span className="text-sm">{fileName}</span>
          {preview ? (
            <FaTimes
              className="text-lg text-red-500 cursor-pointer"
              onClick={resetFile}
            />
          ) : (
            <FaUpload className="text-lg text-gray-500" />
          )}
          <input
            type="file"
            id={props.id}
            {...register(fieldName, { required: props.required })}
            className="hidden"
            onChange={handleFileChange}
            {...props}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
};
