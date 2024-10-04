import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initEnv } from "./utils/env.utils";
import { appRouter } from "./routes";

export const envs = initEnv();
console.log(envs);
import "./utils/multer.utils";
import "./utils/backup.utils";

const app = express();

const PORT = envs.PORT || 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});
app.use("/", appRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
