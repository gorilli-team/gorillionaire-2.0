/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Chog,
  Chog_Transfer,
  Moyaki,
  Moyaki_Transfer,
  Molandak,
  Molandak_Transfer,
} from "generated";

const CHOG_____WHALE_TRANSFER = 100000000000000000000000;
const MOYAKI___WHALE_TRANSFER = 1000000000000000000000000;
const MOLANDAK_WHALE_TRANSFER = 10000000000000000000000;
const CHOG_ADDRESS = "0xE0590015A873bF326bd645c3E1266d4db41C4E6B";
const MOLANDAK_ADDRESS = "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714";
const MOYAKI_ADDRESS = "0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50";
const NOTIFICATION_DELAY = 1000; // 1 second delay between notifications
let lastNotificationTime = 0;

// Helper function to check if transfer is recent (within last hour)
const isRecentTransfer = (transferTimestamp: number): boolean => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  // const oneHourInSeconds = 3600;
  const oneDayInSeconds = 86400;
  return currentTimestamp - transferTimestamp <= oneDayInSeconds;
};

// Helper function to format transfer message
const formatTransferMessage = (
  event: any,
  formattedAmount: string,
  tokenSymbol: string,
  emoji: string
): string => {
  const timestamp = new Date(
    Number(event.block.timestamp) * 1000
  ).toUTCString();
  const blockExplorerUrl = `https://testnet.monadexplorer.com/block/${event.block.number}`;
  const txExplorerUrl = `https://testnet.monadexplorer.com/tx/${event.transaction.hash}`;

  return (
    `${emoji} <b>Large ${tokenSymbol} Token Transfer Alert</b> 💸\n\n` +
    `<b>From:</b> ${event.params.from}\n` +
    `<b>To:</b> ${event.params.to}\n` +
    `<b>Amount:</b> ${formattedAmount} $${tokenSymbol}\n` +
    `<b>Tx:</b> <a href="${txExplorerUrl}">${event.transaction.hash}</a>\n` +
    `<b>Block:</b> <a href="${blockExplorerUrl}">${event.block.number}</a>\n` +
    `<b>Time:</b> ${timestamp}`
  );
};

// Helper function to send Telegram notification
const sendTelegramNotification = async (message: string): Promise<void> => {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramBotToken || !telegramChatId) {
    console.log("Telegram configuration missing");
    throw new Error("Telegram configuration missing");
  }

  // Add delay if needed
  const now = Date.now();
  const timeSinceLastNotification = now - lastNotificationTime;
  if (timeSinceLastNotification < NOTIFICATION_DELAY) {
    await new Promise((resolve) =>
      setTimeout(resolve, NOTIFICATION_DELAY - timeSinceLastNotification)
    );
  }

  const encodedMessage = encodeURIComponent(message);
  const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodedMessage}&parse_mode=HTML`;

  const response = await fetch(telegramUrl);
  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }

  lastNotificationTime = Date.now();
};

Chog.Transfer.handler(async ({ event, context }) => {
  if (event.params.value > CHOG_____WHALE_TRANSFER) {
    const entity: Chog_Transfer = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      from: event.params.from,
      to: event.params.to,
      value: event.params.value,
      blockNumber: BigInt(event.block.number),
      blockTimestamp: BigInt(event.block.timestamp),
      transactionHash: event.transaction.hash,
    };

    try {
      // Store the transfer in the database via a POST request to the backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/signals/transfers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromAddress: entity.from,
            toAddress: entity.to,
            amount: entity.value.toString(),
            blockNumber: entity.blockNumber.toString(),
            blockTimestamp: entity.blockTimestamp.toString(),
            transactionHash: entity.transactionHash,
            tokenSymbol: "CHOG",
            tokenName: "Chog",
            tokenDecimals: 18,
            tokenAddress: CHOG_ADDRESS,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to store transfer: ${response.status} - ${errorText}`
        );
      } else if (response.status === 200) {
        console.log("Transfer already exists");
      } else if (response.status === 201) {
        // here put the telegram notification
        const formattedAmount = (
          Number(event.params.value) / 1e18
        ).toLocaleString();
        const message = formatTransferMessage(
          event,
          formattedAmount,
          "CHOG",
          "🐸"
        );
        await sendTelegramNotification(message);

        console.log("Transfer stored successfully");
      }
    } catch (error) {
      console.error("Failed to track transfer:", error);
    }

    context.Chog_Transfer.set(entity);
  }
});

Molandak.Transfer.handler(async ({ event, context }) => {
  if (event.params.value > MOLANDAK_WHALE_TRANSFER) {
    const entity: Molandak_Transfer = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      from: event.params.from,
      to: event.params.to,
      value: event.params.value,
      blockNumber: BigInt(event.block.number),
      blockTimestamp: BigInt(event.block.timestamp),
      transactionHash: event.transaction.hash,
    };

    try {
      // Store the transfer in the database via a POST request to the backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/signals/transfers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromAddress: entity.from,
            toAddress: entity.to,
            amount: entity.value.toString(),
            blockNumber: entity.blockNumber.toString(),
            blockTimestamp: entity.blockTimestamp.toString(),
            transactionHash: entity.transactionHash,
            tokenSymbol: "DAK",
            tokenName: "Molandak",
            tokenDecimals: 18,
            tokenAddress: MOLANDAK_ADDRESS,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to store transfer: ${response.status} - ${errorText}`
        );
      } else if (response.status === 200) {
        console.log("Transfer already exists");
      } else if (response.status === 201) {
        // Send telegram notification
        const formattedAmount = (
          Number(event.params.value) / 1e18
        ).toLocaleString();
        const message = formatTransferMessage(
          event,
          formattedAmount,
          "MOLANDAK",
          "🦊"
        );
        await sendTelegramNotification(message);

        console.log("Transfer stored successfully");
      }
    } catch (error) {
      console.error("Failed to track transfer:", error);
    }

    context.Molandak_Transfer.set(entity);
  }
});

Moyaki.Transfer.handler(async ({ event, context }) => {
  if (event.params.value > MOYAKI___WHALE_TRANSFER) {
    const entity: Moyaki_Transfer = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      from: event.params.from,
      to: event.params.to,
      value: event.params.value,
      blockNumber: BigInt(event.block.number),
      blockTimestamp: BigInt(event.block.timestamp),
      transactionHash: event.transaction.hash,
    };

    try {
      // Store the transfer in the database via a POST request to the backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/signals/transfers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromAddress: entity.from,
            toAddress: entity.to,
            amount: entity.value.toString(),
            blockNumber: entity.blockNumber.toString(),
            blockTimestamp: entity.blockTimestamp.toString(),
            transactionHash: entity.transactionHash,
            tokenSymbol: "YAKI",
            tokenName: "Moyaki",
            tokenDecimals: 18,
            tokenAddress: MOYAKI_ADDRESS,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to store transfer: ${response.status} - ${errorText}`
        );
      } else if (response.status === 200) {
        console.log("Transfer already exists");
      } else if (response.status === 201) {
        // Send telegram notification
        const formattedAmount = (
          Number(event.params.value) / 1e18
        ).toLocaleString();
        const message = formatTransferMessage(
          event,
          formattedAmount,
          "Moyaki",
          "🌊"
        );
        await sendTelegramNotification(message);

        console.log("Transfer stored successfully");
      }
    } catch (error) {
      console.error("Failed to track transfer:", error);
    }

    context.Moyaki_Transfer.set(entity);
  }
});
