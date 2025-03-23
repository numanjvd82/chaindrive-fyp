import Button from "@/components/Button";
import Input from "@/components/Input";
import RadioGroup from "@/components/RadioGroup";
import Select from "@/components/Select";
import { useCreateListing } from "@/hooks/useCreateListing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { CreateListingSchema } from "./schema";
import { UploadImage } from "./UploadImage";

export type FormValues = z.infer<typeof CreateListingSchema>;

export const Form: React.FC = () => {
  const [previews, setPreviews] = useState<string[]>([]);
  const { createListing, isLoading } = useCreateListing();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(CreateListingSchema),
    defaultValues: {
      title: "",
      model: "",
      year: 1990,
      pricePerDay: 1,
      seats: 4,
      location: "",
      licensePlate: "",
      transmissionType: "manual",
      fuelType: "petrol",
      images: [],
    },
    mode: "onChange",
  });

  const images = watch("images");

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setValue("images", newImages);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("model", values.model);
    formData.append("year", String(values.year));
    formData.append("pricePerDay", String(values.pricePerDay));
    formData.append("seats", String(values.seats));
    formData.append("location", values.location);
    formData.append("licensePlate", values.licensePlate);
    formData.append("transmissionType", values.transmissionType);
    formData.append("fuelType", values.fuelType);
    values.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      // Send vehicle data to the server
      await createListing(formData);
      reset();
      setPreviews([]);
      toast.success("Vehicle listed successfully!", {
        onClose: () => navigate("/listings"),
      });
    } catch (err: any) {
      toast.error(
        err.response?.data.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Input
        label="Title"
        type="text"
        {...register("title")}
        required
        error={errors.title?.message}
      />
      <Input
        label="Model"
        type="text"
        {...register("model")}
        required
        error={errors.model?.message}
      />
      <Input
        label="Year"
        type="number"
        {...register("year", { valueAsNumber: true })}
        required
        error={errors.year?.message}
      />
      <Input
        label="Price per day"
        type="number"
        {...register("pricePerDay", { valueAsNumber: true })}
        required
        error={errors.pricePerDay?.message}
      />
      <Input
        label="Number of seats"
        type="number"
        {...register("seats", { valueAsNumber: true })}
        required
        error={errors.seats?.message}
      />
      <Input
        label="Location"
        type="text"
        {...register("location")}
        required
        error={errors.location?.message}
      />
      <Input
        label="License Plate Number"
        type="text"
        {...register("licensePlate")}
        required
        error={errors.licensePlate?.message}
      />

      <p className="text-sm text-gray-600">Transmission Type</p>
      <RadioGroup
        {...register("transmissionType")}
        name="transmissionType"
        options={[
          { value: "manual", label: "Manual" },
          { value: "automatic", label: "Automatic" },
        ]}
        error={errors.transmissionType?.message}
      />

      <Select
        required
        label="Fuel Type"
        options={[
          { value: "petrol", label: "Petrol" },
          { value: "diesel", label: "Diesel" },
          { value: "electric", label: "Electric" },
          { value: "hybrid", label: "Hybrid" },
        ]}
        optionLabel="Select fuel type"
        {...register("fuelType")}
      />

      <div>
        <UploadImage
          images={images}
          setPreviews={setPreviews}
          setValue={setValue}
          error={errors.images?.message}
        />

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                size="sm"
                onClick={() => removeImage(index)}
                className="absolute -top-1 right-1 rounded-full"
              >
                <IoIosClose />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button isLoading={isLoading} type="submit" className="ml-auto">
        List Vehicle
      </Button>
    </form>
  );
};
