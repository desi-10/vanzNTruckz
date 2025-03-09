import { prisma } from "@/lib/db";
import { validateJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const id = validateJWT(request);

    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        driverProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const status = {
      profilePicture:
        user.image && typeof user.image === "object" && "id" in user.image
          ? true
          : false,
      carPicture:
        user.driverProfile?.carPicture &&
        typeof user.driverProfile?.carPicture === "object" &&
        "id" in user.driverProfile?.carPicture
          ? true
          : false,
      phoneNumber: user.phone ? true : false,
      vehicleType: user.driverProfile?.vehicleType ? true : false,
      numberPlate: user.driverProfile?.numberPlate ? true : false,
      numberPlatePicture:
        user.driverProfile?.numberPlatePicture &&
        typeof user.driverProfile?.numberPlatePicture === "object" &&
        "id" in user.driverProfile?.numberPlatePicture
          ? true
          : false,
      license: user.driverProfile?.license ? true : false,
      licensePicture:
        user.driverProfile?.licensePicture &&
        typeof user.driverProfile?.licensePicture === "object" &&
        "id" in user.driverProfile?.licensePicture
          ? true
          : false,
      licenseExpiry: user.driverProfile?.licenseExpiry ? true : false,

      roadworthySticker:
        user.driverProfile?.roadworthySticker &&
        typeof user.driverProfile?.roadworthySticker === "object" &&
        "id" in user.driverProfile?.roadworthySticker
          ? true
          : false,
      roadworthyExpiry: user.driverProfile?.roadworthyExpiry ? true : false,
      insuranceSticker:
        user.driverProfile?.insuranceSticker &&
        typeof user.driverProfile?.insuranceSticker === "object" &&
        "id" in user.driverProfile?.insuranceSticker
          ? true
          : false,
      insurance: user.driverProfile?.insurance ? true : false,
      ghanaCard: user.driverProfile?.ghanaCard ? true : false,
      ghanaCardPicture:
        user.driverProfile?.ghanaCardPicture &&
        typeof user.driverProfile?.ghanaCardPicture === "object" &&
        "id" in user.driverProfile?.ghanaCardPicture
          ? true
          : false,
    };

    console.log("KYC Status:", status);

    return NextResponse.json(
      { message: "KYC status retrieved successfully", data: status },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving KYC status:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
