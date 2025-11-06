import jwt from "jsonwebtoken";
const generateAccessToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const secret = process.env.JWT_SECRET;
  const expiresInMinutes = parseInt(process.env.ACCESS_TOKEN_EXPIRES_MINUTES || "15", 10);
  if (isNaN(expiresInMinutes) || expiresInMinutes <= 0) {
    throw new Error("ACCESS_TOKEN_EXPIRES_MINUTES must be a positive number");
  }
  const payload = {
    userId,
    type: "access"
  };
  return jwt.sign(payload, secret, {
    expiresIn: `${expiresInMinutes}m`,
    issuer: process.env.JWT_ISSUER || "IT-INCUBATOR-EDUCATION",
    subject: userId.toString(),
    audience: process.env.JWT_AUDIENCE || "IT-INCUBATOR-EDUCATION"
  });
};
export {
  generateAccessToken
};
