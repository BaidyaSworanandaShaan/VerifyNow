import { decryptData } from "@/lib/encryption";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { userId } = await params;
  const headersList = await headers();
  const authorization = headersList.get("Authorization");

  const [_, accessToken] = authorization.split(" ");

  // Verify Access Token
  if (!accessToken) {
    throw new Error("Access Token Not Found!"); // TODO: 404
  }

  const record = await prisma.citizenshipInfo.findUnique({
    where: { userId: parseInt(userId, 10) },
  });

  const data = {
    certificateNumber: decryptData(record.certificateNumber),
    fullName: decryptData(record.fullName),
    gender: decryptData(record.gender),
    dob: decryptData(record.dob),
    birthplace: decryptData(record.birthplace),
    permanentAddress: decryptData(record.permanentAddress),
    wardNumber: decryptData(record.wardNumber),
    frontImg: decryptData(record.frontImg),
    backImg: decryptData(record.backImg),
    userImg: decryptData(record.userImg),
  };

  return Response.json({ data });
}
