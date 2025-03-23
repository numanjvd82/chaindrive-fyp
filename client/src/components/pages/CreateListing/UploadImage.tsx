import useCocoSsdModel from "@/hooks/useCocoSsdModel";
import { createImageElement } from "@/lib/utils";
import { UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import { FormValues } from "./Form";

type Props = {
  images: File[];
  setValue: UseFormSetValue<FormValues>;
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
  error: string | undefined;
};

export const UploadImage: React.FC<Props> = ({
  error,
  images,
  setPreviews,
  setValue,
}) => {
  const model = useCocoSsdModel();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (images.length + files.length > 4) return;

    try {
      for (const file of files) {
        if (!["image/jpeg", "image/png"].includes(file.type)) {
          return toast.error("Invalid file type. Only JPEG and PNG is allowed");
        }
        if (file.size > 2000000) {
          return toast.error("Image size must be less than 2MB");
        }
        if (!model) {
          return toast.error(
            "Image Verification could not be done. Please try again later."
          );
        }
        const img = await createImageElement(file);
        const predictions = await model.detect(img);

        if (!predictions.length) {
          return toast.error(
            "Vehicle image could not be verified. Please upload a clear image."
          );
        }

        console.log(predictions);

        const isValidPicture = predictions.every(
          (prediction) => prediction.class === "car" && prediction.score >= 0.5
        );

        if (!isValidPicture) {
          return toast.error(
            "Vehicle image could not be verified. Please upload an image of a car."
          );
        }
      }

      setValue("images", [...images, ...files]);

      const fileReaders = files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      );

      Promise.all(fileReaders).then((base64Images) => {
        setPreviews((prev) => [...prev, ...base64Images]);
      });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <label>Upload Vehicle Images (Max 4)</label>
      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={!model || images.length >= 4}
          onChange={async (e) => handleImageChange(e)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </>
  );
};
