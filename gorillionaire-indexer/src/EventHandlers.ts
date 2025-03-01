/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */

import {
  Moyaki,
  Moyaki_Transfer,
  Molandak,
  Molandak_Transfer,
} from "generated";

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

  const encodedMessage = encodeURIComponent(message);
  const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodedMessage}&parse_mode=HTML`;

  const response = await fetch(telegramUrl);
  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }
};

Moyaki.Transfer.handler(async ({ event, context }) => {
  if (event.params.value > 10000000000000000000000000) {
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
      if (isRecentTransfer(Number(event.block.timestamp))) {
        const formattedAmount = (
          Number(event.params.value) / 1e18
        ).toLocaleString();
        const message = formatTransferMessage(
          event,
          formattedAmount,
          "MOYAKI",
          "🌊"
        );
        await sendTelegramNotification(message);
      }
    } catch (error) {
      console.error("Failed to send Telegram notification:", error);
    }

    context.Moyaki_Transfer.set(entity);
  }
});

Molandak.Transfer.handler(async ({ event, context }) => {
  if (event.params.value > 100000000000000000000000) {
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
      if (isRecentTransfer(Number(event.block.timestamp))) {
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
      }
    } catch (error) {
      console.error("Failed to send Telegram notification:", error);
    }

    context.Molandak_Transfer.set(entity);
  }
});
