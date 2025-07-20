import { FormValues } from "@/components/pages/Signup/schemas";

export const periodicUserFetchTime = 1000 * 60 * 5; // 5 minutes

export const truncateText = (name: string, maxLength: number = 15) => {
  if (name.length > maxLength) {
    return `${name.slice(0, maxLength)}...`;
  }
  return name;
};

// Converts File to an Image Element
export const createImageElement = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => resolve(img);
  });
};

export const convertBase64ToFile = async (
  base64: string,
  filename: string,
  mimeType: string
): Promise<File> => {
  // Ensure it's a base64-encoded string
  if (!base64) throw new Error("Base64 string is empty");
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new File([array], filename, { type: mimeType });
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        const base64String = reader.result.toString().split(",")[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const convertDateToString = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const convertUtcToLocal = (date: Date) => {
  const timeZoneDifference = new Date().getTimezoneOffset() * 60000;
  return new Date(date).getTime() - timeZoneDifference;
};

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
export const FORM_STORAGE_KEY = "chaindrive-signup-form";

// Function to save form data to localStorage
  export const saveFormData = (data: Partial<FormValues>, step: number) => {
    try {
      // Filter out file objects as they can't be stringified
      const dataToSave = Object.entries(data).reduce((acc, [key, value]) => {
        if (key !== "idCardFront" && key !== "idCardBack" && key !== "selfie") {
          acc[key as keyof Partial<FormValues>] = value;
        }
        return acc;
      }, {} as Partial<FormValues>);
      
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({
        ...dataToSave,
        currentStep: step,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error saving form data to localStorage:", error);
    }
  }

  // Function to load form data from localStorage
  export const loadFormData = (setStep: React.Dispatch<React.SetStateAction<number>>): Partial<FormValues> => {
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Check if data is not too old (24 hours)
        const saveTime = new Date(parsedData.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - saveTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setStep(parsedData.currentStep || 1);
          return parsedData;
        } else {
          // Clear old data
          localStorage.removeItem(FORM_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading form data from localStorage:", error);
    }
    return {};
  }