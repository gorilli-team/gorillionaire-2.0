import { readSignalsData } from "../lib/secretVault";

function convertBigIntToString(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    })
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const schemaId = searchParams.get("schemaId");
    if (!schemaId) {
      throw new Error("Schema ID is required");
    }

    const data = await readSignalsData(schemaId);
    return Response.json({ success: true, data: convertBigIntToString(data) });
  } catch (error) {
    console.error("Failed to read signals data:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
