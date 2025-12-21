import dotenv from "dotenv";
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chat_app",
  jwtSecret: process.env.JWT_SECRET || "dev_secret",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  redisUrl: process.env.REDIS_URL || "",
  enableRedisAdapter: process.env.ENABLE_REDIS_ADAPTER === "true",
};
