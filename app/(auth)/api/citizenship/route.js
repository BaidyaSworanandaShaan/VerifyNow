import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { decryptData } from "@/lib/encryption";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  console.log("🔹 Session Data:", session);

  if (!session) {
    console.error("🔴 Unauthorized Access");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const citizenshipInfo = await prisma.citizenshipInfo.findUnique({
      where: { userId: Number(session?.user?.id) },
    });

    console.log("🔹 Raw Encrypted Data from DB:", citizenshipInfo);

    if (!citizenshipInfo) {
      console.error("🔴 Citizenship data not found");
      return NextResponse.json(
        { error: "Citizenship data not found" },
        { status: 404 }
      );
    }

    // Decrypting only if data exists
    const decryptedData = {
      certificateNumber: citizenshipInfo.certificateNumber
        ? decryptData(citizenshipInfo.certificateNumber)
        : null,
      fullName: citizenshipInfo.fullName
        ? decryptData(citizenshipInfo.fullName)
        : null,
      gender: citizenshipInfo.gender
        ? decryptData(citizenshipInfo.gender)
        : null,
      dob: citizenshipInfo.dob ? decryptData(citizenshipInfo.dob) : null,
      birthplace: citizenshipInfo.birthplace
        ? decryptData(citizenshipInfo.birthplace)
        : null,
      permanentAddress: citizenshipInfo.permanentAddress
        ? decryptData(citizenshipInfo.permanentAddress)
        : null,
      wardNumber: citizenshipInfo.wardNumber
        ? decryptData(citizenshipInfo.wardNumber)
        : null,
      frontImg: citizenshipInfo.frontImg
        ? decryptData(citizenshipInfo.frontImg)
        : null,
      backImg: citizenshipInfo.backImg
        ? decryptData(citizenshipInfo.backImg)
        : null,
      userImg: citizenshipInfo.userImg
        ? decryptData(citizenshipInfo.userImg)
        : null,
    };

    console.log("🔹 Decrypted Data:", decryptedData);

    return NextResponse.json(
      { message: "Success", data: decryptedData },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔴 API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
