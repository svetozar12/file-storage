import { z } from "zod";
import dotenv from "dotenv";

const NodeEnv = z.enum(["development", "test", "production"]);

export function initEnv() {
  dotenv.config();
  const schema = z.object({
    PORT: z.string().min(1).default("3000"),
    NODE_ENV: NodeEnv.default("development"),
    GITHUB_TOKEN: z.string().default(""),
  });

  return schema.parse(process.env);
}
