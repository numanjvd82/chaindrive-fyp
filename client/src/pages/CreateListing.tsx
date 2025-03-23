import Button from "@/components/Button";
import Input from "@/components/Input";
import RadioGroup from "@/components/RadioGroup";
import Select from "@/components/Select";
import { useCreateListing } from "@/hooks/useCreateListing";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(50, {
      message: "Title must be at most 50 characters long",
    }),
  model: z
    .string()
    .min(3, {
      message: "Model must be at least 3 characters long",
    })
    .max(50, {
      message: "Model must be at most 50 characters long",
    }),
  year: z
    .number()
    .int()
    .min(1990, {
      message: "Year must be between 1990 and the current year",
    })
    .max(new Date().getFullYear(), {
      message: "Year must be between 1990 and the current year",
    }),
  pricePerDay: z.number().min(1, {
    message: "Price per day must be at least 1",
  }),
  seats: z.number().int().min(2, {
    message: "Number of seats must be at least 1",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters long",
  }),
  licensePlate: z.string().min(3, {
    message: "License plate must be at least 3 characters long",
  }),
  transmissionType: z.enum(["manual", "automatic"]),
  fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(4, "You can only upload up to 4 images."),
});

type FormValues = z.infer<typeof schema>;

const CreateListing: React.FC = () => {
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
    resolver: zodResolver(schema),
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (images.length + files.length > 4) return;

    for (const file of files) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        return toast.error("Invalid file type. Only JPEG and PNG is allowed");
      }
      if (file.size > 2000000) {
        return toast.error("Image size must be less than 2MB");
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
  };

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
    <div className="bg-gray-100 font-sans">
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold">Add New Vehicle</h2>
        <p className="text-sm mb-4 mt-2">
          Adding a new vehicle to your fleet is simple.
        </p>

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
            <label>Upload Vehicle Images (Max 4)</label>
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={images.length >= 4}
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images.message}</p>
            )}

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
      </div>
    </div>
  );
};

export default CreateListing;
