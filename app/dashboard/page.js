// app/dashboard/page.js (for Next.js 13+ with App Router)
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { decryptData } from "@/lib/encryption";
import DashboardClient from "./DashboardClient";
import { authOptions } from "../(auth)/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Loading...</p>;
  }

  // Fetch the citizenship record from the database
  let citizenshipData = await prisma.citizenshipInfo.findUnique({
    where: { userId: session.user.id },
  });

  if (citizenshipData) {
    citizenshipData = {
      ...citizenshipData,
      certificateNumber: decryptData(citizenshipData.certificateNumber),
      fullName: decryptData(citizenshipData.fullName),
      gender: decryptData(citizenshipData.gender),
      dob: decryptData(citizenshipData.dob),
      birthplace: decryptData(citizenshipData.birthplace),
      permanentAddress: decryptData(citizenshipData.permanentAddress),
      wardNumber: decryptData(citizenshipData.wardNumber),
    };
  }

  return <DashboardClient session={session} initialData={citizenshipData} />;
}
