import jwt from "jsonwebtoken";
import { authError } from '../../../Core/Errors/auth.errors.js';
import * as dotenv from "dotenv";
dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return next(new authError("\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A Authorization \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442.", "header"));
    }
    const headerParts = authHeader.split(" ");
    if (headerParts.length !== 2) {
      return next(new authError("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 Authorization.", "header"));
    }
    const [authType, token] = headerParts;
    if (authType.toLowerCase() === "basic") {
      const credentials = Buffer.from(token, "base64").toString("utf-8");
      const [username, password] = credentials.split(":");
      if (!username || !password) {
        return next(new authError("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 Basic \u0442\u043E\u043A\u0435\u043D\u0430.", "token"));
      }
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return next(new authError("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0443\u0447\u0435\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435.", "token"));
      }
    } else if (authType.toLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.userId = Number(payload.sub);
      } catch {
        return next(new authError("\u0422\u043E\u043A\u0435\u043D \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u043D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u0435\u043D \u0438\u043B\u0438 \u0438\u0441\u0442\u0451\u043A.", "token"));
      }
    } else {
      return next(new authError("\u041D\u0435\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0439 \u0442\u0438\u043F \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438.", "header"));
    }
    console.log("Authorized");
    return next();
  } catch {
    return next(new authError("\u041E\u0448\u0438\u0431\u043A\u0430 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438.", "token"));
  }
}
export {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  authMiddleware
};
