import Button from "@/components/Button";
import DialogModal from "@/components/DialogModal";
import Input from "@/components/Input";
import RadioGroup from "@/components/RadioGroup";
import Select from "@/components/Select";
import { useEditListing } from "@/hooks/useEditListing";
import { Listing } from "@/lib/types";
import { convertBase64ToFile } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import { FormValues } from "../CreateListing/Form";
import { CreateListingSchema } from "../CreateListing/schema";
import { UploadImage } from "../CreateListing/UploadImage";

type Props = {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  listing: Listing | undefined;
  refetch: () => void;
};

type EditFormValues = FormValues;

export const EditModal: React.FC<Props> = ({
  showEditModal,
  setShowEditModal,
  listing,
  refetch,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(CreateListingSchema),
    defaultValues: {
      title: "",
      model: "",
      year: 0,
      pricePerDay: 0,
      seats: 0,
      location: "",
      licensePlate: "",
      transmissionType: "manual",
      fuelType: "petrol",
      images: [],
    },
  });
  const [previews, setPreviews] = useState<string[]>([]);
  const { editListing, isLoading } = useEditListing();

  useEffect(() => {
    if (!listing) return;
    [
      { name: "title", value: listing.title },
      { name: "model", value: listing.model },
      { name: "year", value: listing.year },
      { name: "pricePerDay", value: listing.pricePerDay },
      { name: "seats", value: listing.numOfSeats },
      { name: "location", value: listing.location },
      { name: "licensePlate", value: listing.licensePlate },
      { name: "transmissionType", value: listing.transmissionType },
      { name: "fuelType", value: listing.fuelType },
    ].forEach(({ name, value }) => {
      setValue(name as keyof EditFormValues, value);
    });
    setPreviews(listing.images);
    const imagesAsFiles = listing.images.map(async (image) => {
      const file = await convertBase64ToFile(
        image,
        `image-${Math.random() * 1000}.png`,
        "image/png"
      );
      return file;
    });

    Promise.all(imagesAsFiles).then((files) => {
      setValue("images", files);
    });
  }, [listing, setValue]);

  const images = watch("images");

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setValue("images", newImages);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const onClose = () => {
    setShowEditModal(false);
    if (!listing) return;
    const defaultImages = listing.images.map(async (image) => {
      const file = await convertBase64ToFile(
        image,
        `image-${Math.random() * 1000}.png`,
        "image/png"
      );
      return file;
    });
    Promise.all(defaultImages).then((files) => {
      setValue("images", files);

      // Generate preview URLs from files
      const fileReaders = files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      );

      Promise.all(fileReaders).then((base64Images) => {
        setPreviews(base64Images);
      });
    });
  };

  const onSubmit = async (values: EditFormValues) => {
    if (!listing) return;
    const formData = new FormData();
    formData.append("id", String(listing.id));
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
      await editListing(formData);
      toast.success("Vehicle edited successfully!");
      onClose();
      refetch();
    } catch (err: any) {
      toast.error(
        err.response?.data.message || "An error occurred. Please try again."
      );
    }
  };

  if (!listing) return null;

  return (
    <DialogModal
      title="Edit Listing"
      description="Edit the details of your vehicle listing"
      isOpen={showEditModal}
      onClose={onClose}
    >
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

          <div className="mt-4 grid grid-cols-2 items-center gap-4">
            {previews.map((image, index) => {
              const isBase64 = image.startsWith("data:image/");

              return (
                <div key={index} className="relative">
                  <img
                    src={isBase64 ? image : `data:image/png;base64,${image}`}
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
              );
            })}
          </div>
        </div>

        <Button
          isLoading={isLoading}
          disabled={isLoading}
          type="submit"
          className="ml-auto"
        >
          Edit Vehicle
        </Button>
      </form>
    </DialogModal>
  );
};
