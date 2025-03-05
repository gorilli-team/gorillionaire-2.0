import sendTelegramNotification from "../services/telegram";

export class TransferTracker {
  private tokenName: string;
  private trackedHour: number;
  private trackedMonth: number;
  private transfersPerHour: number;
  private previousHourTransfers: number;

  constructor(tokenName: string) {
    const now = new Date();
    this.tokenName = tokenName;
    this.trackedHour = now.getHours();
    this.trackedMonth = now.getMonth();
    this.transfersPerHour = 0;
    this.previousHourTransfers = 0;
  }

  private formatDateTime(date: Date): string {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, "0");

    return `${day} ${month} ${hour}:00, ${year}`;
  }

  async trackTransfer(entity: any): Promise<void> {
    const date = new Date(Number(entity.block.timestamp) * 1000);
    const currentHour = date.getHours();

    if (currentHour !== this.trackedHour) {
      console.log("NEW HOUR", currentHour, this.trackedHour);

      console.log(
        `[${this.tokenName}] Hourly Summary: ${
          this.transfersPerHour
        } transfers at ${this.formatDateTime(date)}`
      );

      if (this.transfersPerHour > this.previousHourTransfers) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/spike`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tokenName: entity.tokenName,
              tokenSymbol: entity.tokenSymbol,
              tokenDecimals: entity.tokenDecimals,
              tokenAddress: entity.tokenAddress,
              thisHourTransfers: this.transfersPerHour,
              previousHourTransfers: this.previousHourTransfers,
              blockNumber: entity.block.number.toString(),
              blockTimestamp: entity.block.timestamp.toString(),
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Failed to store transfer: ${response.status} - ${errorText}`
          );
        } else {
          const message =
            `🔥 [${
              this.tokenName
            }] Transfer increase detected at ${this.formatDateTime(date)}!\n` +
            `Current hour: ${this.transfersPerHour} transfers\n` +
            `Previous hour: ${this.previousHourTransfers} transfers\n` +
            `Increase: ${(
              ((this.transfersPerHour - this.previousHourTransfers) /
                this.previousHourTransfers) *
              100
            ).toFixed(2)}%`;

          await sendTelegramNotification(message);

          console.log("ACTIVE_SPIKE stored successfully");
        }
      }
      this.previousHourTransfers = this.transfersPerHour;
      this.transfersPerHour = 0;
      this.trackedHour = currentHour;
    }

    this.transfersPerHour++;
  }

  getStats(): {
    transfersPerHour: number;
    previousHourTransfers: number;
    trackedHour: number;
    trackedMonth: number;
  } {
    return {
      transfersPerHour: this.transfersPerHour,
      previousHourTransfers: this.previousHourTransfers,
      trackedHour: this.trackedHour,
      trackedMonth: this.trackedMonth,
    };
  }
}
