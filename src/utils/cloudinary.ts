import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadFile(path: string, file: File | string | null) {
  if (!file) return null;

  let fileUri: string;

  if (typeof file === "string") {
    // Assume it's already a base64 string
    fileUri = file.startsWith("data:") ? file : `data:image/png;base64,${file}`;
  } else {
    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");
    fileUri = `data:${mimeType};${encoding},${base64Data}`;
  }

  const uploadedFile = await cloudinary.uploader.upload(fileUri, {
    invalidate: true,
    resource_type: "auto",
    filename_override: typeof file === "object" ? file.name : undefined,
    folder: path, // Specify the folder where the file should be uploaded
    use_filename: true,
  });

  console.log("Uploaded file:", uploadedFile);

  return {
    url: uploadedFile.secure_url,
    id: uploadedFile.public_id,
  };
}

export const deleteFile = async (fileId: string) => {
  await cloudinary.uploader.destroy(fileId);
};
