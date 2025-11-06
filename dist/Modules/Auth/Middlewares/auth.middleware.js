import jwt from "jsonwebtoken";
import { authError } from '../../../Core/Errors/auth.errors.js';
import * as dotenv from "dotenv";
dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const extractToken = (req) => {
  const auth = req.headers.authorization;
  let accessToken;
  let basicAuth = false;
  const [authType, authToken] = auth.split(" ");
  if (authType === "Bearer") {
    accessToken = authToken;
  }
  if (authType === "Basic") {
    accessToken = authToken;
    basicAuth = true;
  }
  if (!accessToken && req.cookies?.accessToken) {
    accessToken = req.cookies.accessToken;
  }
  return { accessToken, basicAuth };
};
const authMiddleware = async (req, res, next) => {
  const { accessToken, basicAuth } = extractToken(req);
  if (!accessToken) return next(new authError("\u0422\u043E\u043A\u0435\u043D \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D.", "token"));
  if (basicAuth) {
    const credentials = Buffer.from(accessToken, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      next(new authError("\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D.", "token"));
    }
  } else {
    try {
      const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      req.userId = Number(payload.sub);
      return next();
    } catch (error) {
      return next(new authError("\u0422\u043E\u043A\u0435\u043D \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u043D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u0435\u043D.", "token"));
    }
  }
};
export {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  authMiddleware
};
