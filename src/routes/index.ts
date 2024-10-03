import { Router } from "express";
import { uploadRouter } from "./upload";

export const appRouter = Router();

appRouter.use("/upload", uploadRouter);
