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
