import { z } from "zod";

export const fileSchema = z.object({
  mimetype: z.string().refine(
    (val) => {
      return ["image/png", "image/jpeg"].includes(val); // Allow only png and jpeg
    },
    {
      message: "Invalid file type. Only PNG and JPEG are allowed.",
    },
  ),
  size: z.number().max(1024 * 1024 * 5, "File size too large, max 5MB"), // Limit size to 5MB
});
