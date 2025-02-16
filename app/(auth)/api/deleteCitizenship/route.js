import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const deletedRecord = await prisma.citizenshipInfo.delete({
      where: { userId: session.user.id },
    });

    if (!deletedRecord) {
      return new Response(JSON.stringify({ error: "Record not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Citizenship record deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting citizenship record:", error);

    if (error.code === "P2025") {
      return new Response(
        JSON.stringify({ error: "No record found for deletion" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
