import { decryptData } from "@/lib/encryption";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react"; // Use NextAuth for authentication
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, res) {
  // Authenticate the user

  try {
    const { userId } = req.query;

    // Fetch encrypted citizenship data
    const citizenshipInfo = await prisma.citizenshipInfo.findUnique({
      where: { userId: Number(userId) },
    });

    // Decrypt the data before sending it to frontend
    const decryptedData = {
      certificateNumber: decryptData(citizenshipInfo.certificateNumber),
      fullName: decryptData(citizenshipInfo.fullName),
      gender: decryptData(citizenshipInfo.gender),
      dob: decryptData(citizenshipInfo.dob),
      birthplace: decryptData(citizenshipInfo.birthplace),
      permanentAddress: decryptData(citizenshipInfo.permanentAddress),
      wardNumber: decryptData(citizenshipInfo.wardNumber),
      frontImg: decryptData(citizenshipInfo.frontImg),
      backImg: decryptData(citizenshipInfo.backImg),
      userImg: decryptData(citizenshipInfo.userImg),
    };

    return NextResponse.json({
      data: decryptedData,
    });
  } catch (error) {
    console.error("Error retrieving decrypted data:", error);
    // return res.status(500).json({ message: "Internal Server Error" });

    return NextResponse.next();
  }
}
