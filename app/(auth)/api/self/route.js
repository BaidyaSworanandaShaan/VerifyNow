import { decodeJWT } from "@/lib/jwt";
import { headers } from "next/headers";

export async function GET(request, response) {
  const headersList = await headers();
  const authorization = headersList.get("Authorization");

  const [_, accessToken] = authorization.split(" ");

  if (!accessToken) {
    throw new Error("Access Token Not Found!"); // TODO: 404
  }

  // Verify Access Token
  const decoded = await decodeJWT(accessToken);

  return Response.json(
    { data: decoded },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
