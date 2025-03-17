import express, { Request, Response } from "express";
import { readSignalsData } from "./lib/secretVault";

const router = express.Router();

function convertBigIntToString(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    })
  );
}

router.get(
  "/",
  async (req: Request<{}, {}, {}, { schemaId: string }>, res: Response) => {
    try {
      const schemaId = req.query.schemaId;
      if (!schemaId) {
        throw new Error("Schema ID is required");
      }

      const data = await readSignalsData(schemaId);
      res.json({ success: true, data: convertBigIntToString(data) });
    } catch (error) {
      console.error("Failed to read signals data:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;
