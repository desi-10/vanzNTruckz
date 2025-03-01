import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadFile(path: string, file: File | null) {
  if (!file) return null;
  const fileBuffer = await file.arrayBuffer();
  const mimeType = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");

  const fileUri = `data:${mimeType};${encoding},${base64Data}`;

  const uploadedEbook = await cloudinary.uploader.upload(fileUri, {
    invalidate: true,
    resource_type: "auto",
    filename_override: file.name,
    folder: path, // Specify the folder where the file should be uploaded
    use_filename: true,
  });

  console.log("Uploaded file:", uploadedEbook);

  return {
    url: uploadedEbook.secure_url,
    id: uploadedEbook.public_id,
    assetId: uploadedEbook.asset_id,
    originalUlr: uploadedEbook.url,
  };
}

export const deleteFile = async (fileId: string) => {
  await cloudinary.uploader.destroy(fileId);
};
