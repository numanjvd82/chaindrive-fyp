export const periodicUserFetchTime = 1000 * 60 * 5; // 5 minutes

export const truncateFile = (name: string, maxLength: number = 15) => {
  if (name.length > maxLength) {
    return `${name.slice(0, maxLength)}...`;
  }
  return name;
};

export const convertDateToString = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
