export const periodicUserFetchTime = 1000 * 60 * 5; // 5 minutes

export const truncateText = (name: string, maxLength: number = 15) => {
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

export const convertUtcToLocal = (date: Date) => {
  const timeZoneDifference = new Date().getTimezoneOffset() * 60000;
  return new Date(date).getTime() - timeZoneDifference;
};

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
