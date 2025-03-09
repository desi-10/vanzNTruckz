import { prisma } from "@/lib/db";
import { validateJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const id = validateJWT(request);

    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const driver = await prisma.driver.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            phone: true,
            image: true,
          },
        },
      },
    });

    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    const status = {
      profilePicture:
        driver.user.image &&
        typeof driver.user.image === "object" &&
        "id" in driver.user.image
          ? true
          : false,
      carPicture:
        driver.carPicture &&
        typeof driver.carPicture === "object" &&
        "id" in driver.carPicture
          ? true
          : false,
      phoneNumber: driver.user.phone ? true : false,
      vehicleType: driver.vehicleType ? true : false,
      numberPlate: driver.numberPlate ? true : false,
      numberPlatePicture:
        driver.numberPlatePicture &&
        typeof driver.numberPlatePicture === "object" &&
        "id" in driver.numberPlatePicture
          ? true
          : false,
      license: driver.license ? true : false,
      licensePicture:
        driver.licensePicture &&
        typeof driver.licensePicture === "object" &&
        "id" in driver.licensePicture
          ? true
          : false,
      licenseExpiry: driver.licenseExpiry ? true : false,
      roadworthySticker:
        driver.roadworthySticker &&
        typeof driver.roadworthySticker === "object" &&
        "id" in driver.roadworthySticker
          ? true
          : false,
      roadworthyExpiry: driver.roadworthyExpiry ? true : false,
      insuranceSticker:
        driver.insuranceSticker &&
        typeof driver.insuranceSticker === "object" &&
        "id" in driver.insuranceSticker
          ? true
          : false,
      insurance: driver.insurance ? true : false,
      ghanaCard: driver.ghanaCard ? true : false,
      ghanaCardPicture:
        driver.ghanaCardPicture &&
        typeof driver.ghanaCardPicture === "object" &&
        "id" in driver.ghanaCardPicture
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
