import { Request, Response, Router } from "express";
import { upload, uploadDir } from "../../utils/multer.utils";
import { fileSchema } from "./constants";
import sharp from "sharp";
import fs from "fs";

export const uploadRouter = Router();

uploadRouter.post(
  "/",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      const validationResult = fileSchema.safeParse({
        mimetype: file?.mimetype,
        size: file?.size,
      });

      console.log(file);
      const targetPath = `${uploadDir}/${Date.now()}-${file?.originalname}`;

      await sharp(file?.path)
        .resize(800) // Resize to 800px width (adjust as needed)
        .jpeg({ quality: 80 }) // Compress image
        .toFile(targetPath); // Save to target directory

      // Delete the temporary file after processing
      fs.unlink(file?.path || "", (err) => {
        if (err) {
          console.error("Failed to delete temporary file:", err);
        }
      });
      if (!validationResult.success) {
        res.status(400).json({ errors: validationResult });
        return;
      }

      res.status(201).send("Hooray");
      return;
    } catch (error) {
      res.status(400).send("Bad " + error);
      return;
    }
  },
);
