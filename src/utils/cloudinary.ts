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

  const uploadedFile = await cloudinary.uploader.upload(fileUri, {
    invalidate: true,
    resource_type: "auto",
    filename_override: file.name,
    folder: path, // Specify the folder where the file should be uploaded
    use_filename: true,
  });

  console.log("Uploaded file:", uploadedFile);

  return {
    url: uploadedFile.secure_url,
    id: uploadedFile.public_id,
    // assetId: uploadedFile.asset_id,
    // originalUlr: uploadedFile.url,
  };
}

export const deleteFile = async (fileId: string) => {
  await cloudinary.uploader.destroy(fileId);
};

export const uploadFileToCloudinary = async (
  folder: string,
  file: File | null
) => {
  if (!file) return null;

  return new Promise((resolve) => {
    console.log(`Uploading ${file.name} to ${folder}...`);
    setTimeout(() => {
      const result = {
        id: `${Date.now()}`,
        url: `http://localhost:300/${folder}/${file.name}`,
      };
      console.log("Upload result:", result);
      resolve(result);
    }, 2000); // Simulate 2 seconds delay
  });
};
