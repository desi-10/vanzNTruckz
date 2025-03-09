import { prisma } from "@/lib/db";
import { deleteFile, uploadFile } from "@/utils/cloudinary";
import { validateJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { z } from "zod";

const kycSchema = z.object({
  profilePicture: z.instanceof(File).optional().nullable(),
  carPicture: z.instanceof(File).optional().nullable(),
  phoneNumber: z
    .string()
    .length(10, "Invalid phone number")
    .optional()
    .nullable(),
  vehicleType: z.string().optional().nullable(),
  numberPlate: z.string().optional().nullable(),
  numberPlatePicture: z.instanceof(File).optional().nullable(),
  license: z.string().optional().nullable(),
  licensePicture: z.instanceof(File).optional().nullable(),
  licenseExpiry: z.string().optional().nullable(),
  roadworthySticker: z.instanceof(File).optional().nullable(),
  roadworthyExpiry: z.string().optional().nullable(),
  insuranceSticker: z.instanceof(File).optional().nullable(),
  insurance: z.string().optional().nullable(),
  ghanaCard: z.string().optional().nullable(),
  ghanaCardPicture: z.instanceof(File).optional().nullable(),
});

export const PATCH = async (request: Request) => {
  try {
    const id = validateJWT(request);

    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      console.log(validate.error.format());
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
      process.env.NODE_ENV === "production"
        ? file
          ? uploadFile(folder, file)
          : null
        : file
        ? { id: "123", url: "http://localhost:300/profile/test.jpg" }
        : null;

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
          phone: (validate.data.phoneNumber as string) || user.phone || "",
          image: uploadResults[0] || {},
        },
      });

      return await tx.driver.upsert({
        where: { userId: user.id },
        update: {
          numberPlate:
            validate.data.numberPlate || user.driverProfile?.numberPlate || "",
          license: validate.data.license || user.driverProfile?.license || "",
          vehicleType:
            validate.data.vehicleType || user.driverProfile?.vehicleType || "",
          licenseExpiry: validate.data.licenseExpiry
            ? new Date(validate.data.licenseExpiry)
            : user.driverProfile?.licenseExpiry,
          roadworthyExpiry: validate.data.roadworthyExpiry
            ? new Date(validate.data.roadworthyExpiry)
            : user.driverProfile?.roadworthyExpiry,
          profilePicture:
            uploadResults[0] || user.driverProfile?.profilePicture || {},
          carPicture: uploadResults[1] || user.driverProfile?.carPicture || {},
          numberPlatePicture:
            uploadResults[2] || user.driverProfile?.numberPlatePicture || {},
          licensePicture:
            uploadResults[3] || user.driverProfile?.licensePicture || {},
          roadworthySticker:
            uploadResults[4] || user.driverProfile?.roadworthySticker || {},
          insuranceSticker:
            uploadResults[5] || user.driverProfile?.insuranceSticker || {},
          ghanaCardPicture:
            uploadResults[6] || user.driverProfile?.ghanaCardPicture || {},
        },
        create: {
          user: { connect: { id: user.id } },
          numberPlate:
            validate.data.numberPlate || user.driverProfile?.numberPlate || "",
          license: validate.data.license || user.driverProfile?.license || "",
          vehicleType:
            validate.data.vehicleType || user.driverProfile?.vehicleType || "",
          licenseExpiry: validate.data.licenseExpiry
            ? new Date(validate.data.licenseExpiry)
            : user.driverProfile?.licenseExpiry,
          roadworthyExpiry: validate.data.roadworthyExpiry
            ? new Date(validate.data.roadworthyExpiry as string)
            : user.driverProfile?.roadworthyExpiry,
          profilePicture:
            uploadResults[0] || user.driverProfile?.profilePicture || {},
          carPicture: uploadResults[1] || user.driverProfile?.carPicture || {},
          numberPlatePicture:
            uploadResults[2] || user.driverProfile?.numberPlatePicture || {},
          licensePicture:
            uploadResults[3] || user.driverProfile?.licensePicture || {},
          roadworthySticker:
            uploadResults[4] || user.driverProfile?.roadworthySticker || {},
          insuranceSticker:
            uploadResults[5] || user.driverProfile?.insuranceSticker || {},
          ghanaCardPicture:
            uploadResults[6] || user.driverProfile?.ghanaCardPicture || {},
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
