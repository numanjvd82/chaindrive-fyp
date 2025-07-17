import React, { useState } from "react";
import { FieldValues, useFormContext, UseFormRegister } from "react-hook-form";
import { FaTimes, FaUpload } from "react-icons/fa";
import { truncateText } from "../lib/utils";

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
  const { setValue } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("Select File");
  
  // Generate unique ID for the input
  const inputId = props.id || `file-input-${fieldName}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileName(truncateText(file.name));
    } else {
      resetFile();
    }

    onChange?.(e);
  };

  const resetFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName("Select File");
    setValue(fieldName, null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="file"
          id={inputId}
          {...register(fieldName, { required: props.required })}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          {...props}
        />
        
        <label
          htmlFor={inputId}
          className={`relative block w-full border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer group ${
            error 
              ? "border-red-300 bg-red-50 hover:border-red-400" 
              : preview 
                ? "border-green-300 bg-green-50 hover:border-green-400"
                : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          {preview ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">{fileName}</p>
                <p className="text-xs text-gray-500 mt-1">Click to change file</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  resetFile();
                }}
                className="absolute top-3 right-3 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  error ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-500"
                }`}>
                  <FaUpload size={20} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {fileName !== "Select File" ? fileName : "Select File"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG only • Max 2MB
                </p>
              </div>
            </div>
          )}
        </label>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
