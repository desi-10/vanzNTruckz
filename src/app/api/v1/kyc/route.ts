import { prisma } from "@/lib/db";
import { deleteFile, uploadFile } from "@/utils/cloudinary";
import { validateJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { z } from "zod";

const kycSchema = z.object({
  profilePicture: z.instanceof(File).optional(),
  carPicture: z.instanceof(File).optional(),
  phoneNumber: z.string().length(10, "Invalid phone number").optional(),
  vehicleType: z.string().optional(),
  numberPlate: z.string().optional(),
  numberPlatePicture: z.instanceof(File).optional(),
  license: z.string().optional(),
  licensePicture: z.instanceof(File).optional(),
  licenseExpiry: z.string().optional(),
  roadworthySticker: z.instanceof(File).optional(),
  roadworthyExpiry: z.string().optional(),
  insuranceSticker: z.instanceof(File).optional(),
  insurance: z.string().optional(),
  ghanaCard: z.string().optional(),
  ghanaCardPicture: z.instanceof(File).optional(),
});

export const PATCH = async (request: Request) => {
  try {
    const id = validateJWT(request);
    const user = await prisma.user.findUnique({
      where: { id },
      include: { driverProfile: true },
    });

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
      insurance: body.get("insurance"),
      ghanaCard: body.get("ghanaCard"),
      ghanaCardPicture: body.get("ghanaCardPicture"),
    });

    if (!validate.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: validate.error.format() },
        { status: 400 }
      );
    }

    const filteredData = Object.fromEntries(
      Object.entries(validate.data).filter(
        ([, value]) => value !== null && value !== "" && value !== undefined
      )
    );

    const deleteExistingFile = async (obj: { id: string }) => {
      if (obj && typeof obj === "object" && "id" in obj) {
        await deleteFile(obj.id);
      }
    };

    const filesToDelete = [
      user.image,
      user.driverProfile?.profilePicture,
      user.driverProfile?.carPicture,
      user.driverProfile?.numberPlatePicture,
      user.driverProfile?.licensePicture,
      user.driverProfile?.roadworthySticker,
      user.driverProfile?.insuranceSticker,
      user.driverProfile?.ghanaCardPicture,
    ].filter(
      (file): file is { id: string } => file !== undefined || file !== null
    );

    await Promise.all(filesToDelete.map(deleteExistingFile));

    const [existingPhoneNumber, existingLicense, existingNumberPlate] =
      await Promise.all([
        prisma.user.findUnique({
          where: { phone: (filteredData.phoneNumber as string) || "" },
        }),
        prisma.driver.findUnique({
          where: { license: (filteredData.license as string) || "" },
        }),
        prisma.driver.findUnique({
          where: { numberPlate: (filteredData.numberPlate as string) || "" },
        }),
      ]);

    if (existingPhoneNumber && existingPhoneNumber.id !== user.id) {
      return NextResponse.json(
        { error: "Phone number already in use" },
        { status: 409 }
      );
    }

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

    const uploadFileToCloudinary = async (folder: string, file?: File) =>
      file ? uploadFile(folder, file) : null;

    const uploadFolders = [
      "profile",
      "car",
      "number_plate",
      "license",
      "roadworthy",
      "insurance",
      "ghana_card",
    ];

    const uploadKeys = [
      "profilePicture",
      "carPicture",
      "numberPlatePicture",
      "licensePicture",
      "roadworthySticker",
      "insuranceSticker",
      "ghanaCardPicture",
    ];

    const uploadResults = await Promise.all(
      uploadKeys.map((key, index) =>
        uploadFileToCloudinary(uploadFolders[index], filteredData[key] as File)
      )
    );

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          phone: (filteredData.phoneNumber as string) || "",
          image: uploadResults[0] || {},
        },
      });

      return await tx.driver.upsert({
        where: { userId: user.id },
        update: {
          ...filteredData,
          licenseExpiry: filteredData.licenseExpiry
            ? new Date(filteredData.licenseExpiry as string)
            : undefined,
          roadworthyExpiry: filteredData.roadworthyExpiry
            ? new Date(filteredData.roadworthyExpiry as string)
            : undefined,
          profilePicture: uploadResults[0] || {},
          carPicture: uploadResults[1] || {},
          numberPlatePicture: uploadResults[2] || {},
          licensePicture: uploadResults[3] || {},
          roadworthySticker: uploadResults[4] || {},
          insuranceSticker: uploadResults[5] || {},
          ghanaCardPicture: uploadResults[6] || {},
        },
        create: {
          user: { connect: { id: user.id } },
          ...filteredData,
          licenseExpiry: filteredData.licenseExpiry
            ? new Date(filteredData.licenseExpiry as string)
            : undefined,
          roadworthyExpiry: filteredData.roadworthyExpiry
            ? new Date(filteredData.roadworthyExpiry as string)
            : undefined,
          profilePicture: uploadResults[0] || {},
          carPicture: uploadResults[1] || {},
          numberPlatePicture: uploadResults[2] || {},
          licensePicture: uploadResults[3] || {},
          roadworthySticker: uploadResults[4] || {},
          insuranceSticker: uploadResults[5] || {},
          ghanaCardPicture: uploadResults[6] || {},
        },
      });
    });

    return NextResponse.json(
      { message: "Driver updated successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating KYC:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
