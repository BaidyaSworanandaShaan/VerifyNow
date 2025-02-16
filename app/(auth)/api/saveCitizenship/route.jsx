import { encryptData } from "@/lib/encryption";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req) {
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();

    const {
      certificateNumber,
      fullName,
      gender,
      dob,
      birthplace,
      permanentAddress,
      wardNumber,
      frontImg,
      backImg,
      userImg,
    } = body;

    // Encrypt all sensitive data
    const encryptedData = {
      certificateNumber: encryptData(certificateNumber),
      fullName: encryptData(fullName),
      gender: encryptData(gender),
      dob: encryptData(dob),
      birthplace: encryptData(birthplace),
      permanentAddress: encryptData(permanentAddress),
      wardNumber: encryptData(wardNumber),
      frontImg: encryptData(frontImg),
      backImg: encryptData(backImg),
      userImg: encryptData(userImg),
    };

    // Save encrypted data in the database
    const citizenshipInfo = await prisma.citizenshipInfo.create({
      data: {
        userId: session.user.id,
        certificateNumber: encryptedData.certificateNumber,
        fullName: encryptedData.fullName,
        gender: encryptedData.gender,
        dob: encryptedData.dob,
        birthplace: encryptedData.birthplace,
        permanentAddress: encryptedData.permanentAddress,
        wardNumber: encryptedData.wardNumber,
        frontImg: encryptedData.frontImg,
        backImg: encryptedData.backImg,
        userImg: encryptedData.userImg,
      },
    });

    return NextResponse.json({
      message: "Citizenship Information Stored Securely",
      data: citizenshipInfo,
    });
  } catch (error) {
    console.error("Error saving encrypted citizenship info:", error);

    // Use NextResponse.json() to send the error response
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 } // Internal Server Error
    );
  }
}
