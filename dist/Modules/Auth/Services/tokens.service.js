import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { TokensRepository } from '../Repositories/tokes.repository.js';
import { authError } from '../../../Core/Errors/auth.errors.js';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRES = parseInt(String(process.env.ACCESS_TOKEN_EXPIRES_SECONDS || 10), 10);
const REFRESH_TOKEN_EXPIRES = parseInt(String(process.env.REFRESH_TOKEN_EXPIRES_SECONDS || 20), 10);
const TokensService = {
  async genAccessToken(userData) {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign(
      { userData },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );
    return {
      accessToken: token,
      userData,
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRES * 1e3)
    };
  },
  async genRefreshToken(userData) {
    if (!JWT_REFRESH_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign(
      { userData },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );
    return {
      refreshToken: token,
      userData,
      expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRES * 1e3)
    };
  },
  async verifyRefreshToken(refreshToken) {
    try {
      const tokenRecord = await this.getRefreshTokenRecord(refreshToken);
      if (!tokenRecord || tokenRecord.token !== refreshToken || tokenRecord.expiresAt < /* @__PURE__ */ new Date())
        throw new authError("\u0422\u043E\u043A\u0435\u043D \u043F\u0440\u043E\u0434\u043B\u0435\u043D\u0438\u044F \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0438\u043B\u0438 \u043D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u0435\u043D.", "refreshToken");
      jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      await this.deleteRefreshTokenRecord(refreshToken);
      return true;
    } catch (err) {
      throw new authError("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u0442\u043E\u043A\u0435\u043D\u0430.", "refreshToken");
    }
  },
  async createRefreshToken(userId, refreshToken, expires) {
    await TokensRepository.createRefreshTokenRecord(userId, refreshToken, expires);
  },
  async getRefreshTokenRecord(refreshToken) {
    return await TokensRepository.getRefreshTokenRecord(refreshToken);
  },
  async deleteRefreshTokenRecord(refreshToken) {
    await TokensRepository.deleteRefreshTokenRecord(refreshToken);
  }
};
export {
  TokensService
};
