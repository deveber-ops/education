import jwt from "jsonwebtoken";
import { authError } from '../../../Core/Errors/auth.errors.js';
import * as dotenv from "dotenv";
dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;
    let accessToken;
    let isBasic = false;
    if (authHeader) {
      const [authType, token] = authHeader.split(" ");
      if (authType === "Bearer") {
        accessToken = token || cookieToken;
      } else if (authType === "Basic") {
        accessToken = token;
        isBasic = true;
      } else {
        return next(new authError("\u041D\u0435\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0439 \u0442\u0438\u043F \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438.", "token"));
      }
    } else if (cookieToken) {
      accessToken = cookieToken;
    }
    if (!accessToken) {
      return next(new authError("\u0422\u043E\u043A\u0435\u043D \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D.", "token"));
    }
    if (isBasic) {
      const credentials = Buffer.from(accessToken, "base64").toString("utf-8");
      const [username, password] = credentials.split(":");
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return next(new authError("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0443\u0447\u0435\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435.", "token"));
      }
      console.log("\u2705 Basic Auth passed");
      return next();
    }
    try {
      const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      req.userId = Number(payload.sub);
      console.log("\u2705 Bearer Auth passed");
      return next();
    } catch {
      return next(new authError("\u0422\u043E\u043A\u0435\u043D \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u043D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u0435\u043D.", "token"));
    }
  } catch {
    return next(new authError("\u041E\u0448\u0438\u0431\u043A\u0430 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438.", "token"));
  }
}
export {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  authMiddleware
};
