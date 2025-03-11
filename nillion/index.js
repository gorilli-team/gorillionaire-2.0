import { pushNewSignalsToSecretVault } from "./readWriteSv.js";
import { closeConnection, fetchData } from "./mongodb.js";

const DATA_POLLING_INTERVAL = 30 * 60 * 1000; // 30 minutes

async function fetchAndUpdateData() {
    try {
        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() - 30);
        const currentDateISO = currentDate.toISOString();

        console.log("Fetching new signals from MongoDB...");
        const data = await fetchData(currentDateISO);

        if (data === "") {
            console.log("No new signals found in MongoDB");
            return null;
        }

        console.log("Pushing signals to Nillion's Secret Vault...");
        await pushNewSignalsToSecretVault(data);

        console.log("New signals successfully pushed to Nillon's Secret Vault");
    } catch (error) {
        console.error("Error pushing new signals to Nillion:", error);
    } finally {
        closeConnection();
    }
}

function startDataPolling() {
    console.log(
        `Starting data polling with interval: ${
            DATA_POLLING_INTERVAL / 60000
        } minutes`
    );
    fetchAndUpdateData();
    setInterval(fetchAndUpdateData, DATA_POLLING_INTERVAL);

}

function main() {
    startDataPolling();
}

main();