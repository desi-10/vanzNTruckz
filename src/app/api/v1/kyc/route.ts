import { prisma } from "@/lib/db";
import { deleteFile, uploadFile } from "@/utils/cloudinary";
import { validateJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { z } from "zod";

const kycSchema = z.object({
  profilePicture: z.custom<File>((file) => file instanceof File, {
    message: "Invalid profile picture",
  }),
  carPicture: z.custom<File>((file) => file instanceof File, {
    message: "Invalid car picture",
  }),
  phoneNumber: z.string(),
  vehicleType: z.string(),
  numberPlate: z.string(),
  numberPlatePicture: z.custom<File>((file) => file instanceof File, {
    message: "Invalid number plate picture",
  }),
  license: z.string(),
  licensePicture: z.custom<File>((file) => file instanceof File, {
    message: "Invalid license picture",
  }),
  licenseExpiry: z.string(),
  roadworthySticker: z.custom<File>((file) => file instanceof File, {
    message: "Invalid roadworthy sticker picture",
  }),
  roadworthyExpiry: z.string(),
  insuranceSticker: z.custom<File>((file) => file instanceof File, {
    message: "Invalid insurance sticker picture",
  }),
  insurance: z.string(),
  ghanaCard: z.string().optional(),
  ghanaCardPicture: z.custom<File>((file) => file instanceof File).optional(),
});

export const PATCH = async (request: Request) => {
  try {
    const user = await validateJWT(request);

    if (!user || user.role !== "DRIVER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.formData();

    const validate = kycSchema.safeParse({
      profilePicture: body.get("profilePicture"),
      carPicture: body.get("carPicture"),
      phoneNumber: body.get("phoneNumber"),
      vehicleType: body.get("vehicleType"),
      numberPlate: body.get("numberPlate"),
      numberPlatePicture: body.get("numberPlatePicture"),
      license: body.get("license"),
      licensePicture: body.get("licensePicture"),
      licenseExpiry: body.get("licenseExpiry"),
      roadworthySticker: body.get("roadworthySticker"),
      roadworthyExpiry: body.get("roadworthyExpiry"),
      insuranceSticker: body.get("insuranceSticker"),
      ghanaCard: body.get("ghanaCard"),
      ghanaCardPicture: body.get("ghanaCardPicture"),
    });

    if (!validate.success) {
      return NextResponse.json({
        error: "Invalid data",
        errors: validate.error.format(),
      });
    }

    const {
      profilePicture,
      carPicture,
      phoneNumber,
      vehicleType,
      numberPlate,
      numberPlatePicture,
      license,
      licensePicture,
      licenseExpiry,
      roadworthySticker,
      roadworthyExpiry,
      insuranceSticker,
      ghanaCard,
      ghanaCardPicture,
    } = validate.data;

    // Delete old profile picture if exists
    if (user.image && typeof user.image === "object" && "id" in user.image) {
      await deleteFile((user.image as { id: string }).id);
    }

    const uploadFileToCloudinary = async (
      folder: string,
      file: File | null
    ) => {
      if (!file) return null;
      const result = await uploadFile(folder, file);
      if (!result) throw new Error(`Failed to upload ${folder} picture`);
      return result;
    };

    const uploadResults = await Promise.all([
      uploadFileToCloudinary("profile", profilePicture),
      uploadFileToCloudinary("cars", carPicture),
      uploadFileToCloudinary("number_plate", numberPlatePicture),
      uploadFileToCloudinary("license", licensePicture),
      uploadFileToCloudinary("roadworthy", roadworthySticker),
      uploadFileToCloudinary("insurance", insuranceSticker),
      ghanaCardPicture &&
        uploadFileToCloudinary("ghana_card", ghanaCardPicture),
    ]);

    const [
      profilePictureResult,
      carPictureResult,
      numberPlatePictureResult,
      licensePictureResult,
      roadworthyStickerResult,
      insuranceStickerResult,
      ghanaCardPictureResult,
    ] = uploadResults;

    const [existingLicense, existingNumberPlate] = await Promise.all([
      prisma.driver.findUnique({ where: { license } }),
      prisma.driver.findUnique({ where: { numberPlate } }),
    ]);

    if (existingLicense && existingLicense.userId !== user.id) {
      return NextResponse.json(
        { error: "License already in use" },
        { status: 409 }
      );
    }

    if (existingNumberPlate && existingNumberPlate.userId !== user.id) {
      return NextResponse.json(
        { error: "Number plate already in use" },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Update user profile picture and phone number
      await tx.user.update({
        where: { id: user.id },
        data: {
          image: profilePictureResult || undefined,
          phone: phoneNumber,
        },
      });

      await tx.driver.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          vehicleType,
          numberPlate,
          license,
          licenseExpiry: new Date(licenseExpiry),
          roadworthyExpiry: new Date(roadworthyExpiry),
          insuranceSticker: insuranceStickerResult || undefined,
          ghanaCard,
          profilePicture: profilePictureResult || undefined,
          carPicture: carPictureResult || undefined,
          numberPlatePicture: numberPlatePictureResult || undefined,
          licensePicture: licensePictureResult || undefined,
          roadworthySticker: roadworthyStickerResult || undefined,
          ghanaCardPicture: ghanaCardPictureResult || undefined,
        },
        update: {
          vehicleType,
          numberPlate,
          license,
          licenseExpiry: new Date(licenseExpiry),
          roadworthyExpiry: new Date(roadworthyExpiry),
          insuranceSticker: insuranceStickerResult || undefined,
          ghanaCard,
          profilePicture: profilePictureResult || undefined,
          carPicture: carPictureResult || undefined,
          numberPlatePicture: numberPlatePictureResult || undefined,
          licensePicture: licensePictureResult || undefined,
          roadworthySticker: roadworthyStickerResult || undefined,
          ghanaCardPicture: ghanaCardPictureResult || undefined,
        },
      });
    });

    return NextResponse.json(
      { message: "Driver updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating KYC:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
