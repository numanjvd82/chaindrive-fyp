export const sql = String.raw;
export const sessionExpiry = 1000 * 60 * 60; // 1 hour

export const convertFiletoBuffer = async (
  file: File
): Promise<ArrayBufferLike> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBufferLike);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const convertBufferToBase64 = (buffer: ArrayBufferLike): string => {
  return Buffer.from(buffer).toString("base64");
};
