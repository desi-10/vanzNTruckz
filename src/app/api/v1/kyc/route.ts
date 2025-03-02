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
  license: z.string(),
  licenseExpiry: z.string(),
  roadworthySticker: z.string(),
  roadworthyExpiry: z.string(),
  insuranceSticker: z.string(),
  ghanaCard: z.string().optional(),
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
      numberPlate: body.get("numberPlate"),
      license: body.get("license"),
      licenseExpiry: body.get("licenseExpiry"),
      roadworthySticker: body.get("roadworthySticker"),
      roadworthyExpiry: body.get("roadworthyExpiry"),
      insuranceSticker: body.get("insuranceSticker"),
      ghanaCard: body.get("ghanaCard"),
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
      numberPlate,
      vehicleType,
      license,
      licenseExpiry,
      roadworthySticker,
      roadworthyExpiry,
      insuranceSticker,
      ghanaCard,
    } = validate.data;

    let profilePictureResult: { url: string; id: string } | null = null;
    let carPictureResult: { url: string; id: string } | null = null;

    const uploadPromises: Promise<void>[] = [];

    if (profilePicture) {
      if (user.image && typeof user.image === "object" && "id" in user.image) {
        await deleteFile((user.image as { id: string }).id);
      }
      const profilePromise = uploadFile("profile", profilePicture).then(
        (result) => {
          if (!result) {
            throw new Error("Invalid profile picture");
          }
          profilePictureResult = result;
        }
      );
      uploadPromises.push(profilePromise);
    }

    if (carPicture) {
      if (
        user.driverProfile?.carPicture &&
        typeof user.driverProfile?.carPicture === "object" &&
        "id" in user.driverProfile?.carPicture
      ) {
        await deleteFile((user.driverProfile.carPicture as { id: string }).id);
      }
      const carPromise = uploadFile("cars", carPicture).then((result) => {
        if (!result) {
          throw new Error("Invalid car picture");
        }
        carPictureResult = result;
      });
      uploadPromises.push(carPromise);
    }

    await Promise.all(uploadPromises);

    if (profilePicture && !profilePictureResult) {
      return NextResponse.json(
        { error: "Invalid profile picture" },
        { status: 400 }
      );
    }

    if (carPicture && !carPictureResult) {
      return NextResponse.json(
        { error: "Invalid car picture" },
        { status: 400 }
      );
    }

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

    await prisma.$transaction(
      async (tx) => {
        if (profilePictureResult) {
          await tx.user.update({
            where: { id: user.id },
            data: { image: profilePictureResult, phone: phoneNumber },
          });
        }

        // Use UPSERT here
        await tx.driver.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            profilePicture: profilePictureResult || undefined,
            carPicture: carPictureResult || undefined,
            vehicleType,
            numberPlate,
            license,
            licenseExpiry: new Date(licenseExpiry),
            roadworthySticker,
            roadworthyExpiry: new Date(roadworthyExpiry),
            insuranceSticker,
            ghanaCard,
          },
          update: {
            profilePicture: profilePictureResult || undefined,
            carPicture: carPictureResult || undefined,
            vehicleType,
            numberPlate,
            license,
            licenseExpiry: new Date(licenseExpiry),
            roadworthySticker,
            roadworthyExpiry: new Date(roadworthyExpiry),
            insuranceSticker,
            ghanaCard,
          },
        });
      },
      { isolationLevel: "Serializable" }
    );

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
