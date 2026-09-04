const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

export async function fileToJpegBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas wordt niet ondersteund in deze browser.");
  }
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const resizedDataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  const base64 = resizedDataUrl.split(",")[1] ?? "";
  return { base64, mediaType: "image/jpeg" };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Kon bestand niet lezen."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Kon afbeelding niet laden."));
    image.src = src;
  });
}
