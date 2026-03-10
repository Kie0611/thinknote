import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  ARCJET_ENV: process.env.ARCJET_ENV || "development",
  ARCJET_KEY: process.env.ARCJET_KEY,
}