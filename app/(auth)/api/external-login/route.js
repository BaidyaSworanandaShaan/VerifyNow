import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateJWT } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function POST(request) {
  const res = await request.json();

  const user = await prisma.user.findUnique({
    where: { email: res.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await bcrypt.compare(res.password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid password");
  }

  const accessToken = await generateJWT(user);

  return Response.json({ accessToken });
}
