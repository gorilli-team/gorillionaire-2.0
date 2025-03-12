export const fetchSignalsData = async () => {
  try {
    const response = await fetch(
      `/api/survey/data?schemaId=${process.env.SCHEMA_ID}`
    );
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
  } catch (error) {
    console.error("Failed to fetch signals data:", error);
  }
};
