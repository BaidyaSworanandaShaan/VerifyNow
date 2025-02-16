import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export async function generateJWT(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET);
}

export async function decodeJWT(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}
