import cron from "node-cron";
import PriceOracle from "../services/PriceOracle";

// Initialize the cron job
export function initPriceUpdateCron() {
  // Run every 5 minutes
  return cron.schedule("*/5 * * * *", async () => {
    try {
      console.log("Updating prices...");
      const priceOracle = new PriceOracle();
      await priceOracle.updatePrices();

      console.log("Successfully updated prices");
    } catch (error) {
      console.error("Failed to update prices:", error);
    }
  });
}
