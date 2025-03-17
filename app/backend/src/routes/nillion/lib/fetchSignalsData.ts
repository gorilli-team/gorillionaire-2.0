import { env } from "../../../services/Env";

export const fetchSignalsData = async () => {
  try {
    const response = await fetch(
      `/api/survey/data?schemaId=${env.nillion.schemaId}`
    );
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
  } catch (error) {
    console.error("Failed to fetch signals data:", error);
  }
};
