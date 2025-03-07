"use client";

import React, { useCallback } from "react";
import Button from "../button";
import { Token } from "@/app/types";
import {
  useAccount,
  useReadContracts,
  useSendTransaction,
  useSignTypedData,
  useWriteContract,
} from "wagmi";
import { numberToHex, size, concat, erc20Abi, parseUnits } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useConfig } from "wagmi";
import { trackedTokens } from "@/app/shared/tokenData";

const MOLANDAK_ADDRESS = "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714" as const;
const WMONAD_ADDRESS = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701" as const;
const PERMIT2_ADDRESS = "0x000000000022d473030f116ddee9f6b43ac78ba3" as const;
const MONAD_CHAIN_ID = 10143;

export default function Trades() {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const { data } = useReadContracts({
    contracts: trackedTokens.map((t) => ({
      address: t.address as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
      chainId: MONAD_CHAIN_ID,
    })),
  });
  console.log("balances", data);

  const config = useConfig();

  const buyNotifications = [
    {
      token: {
        name: "MOLANDAK",
        address: MOLANDAK_ADDRESS,
        symbol: "DAK",
        decimals: 18,
      },
      amount: 23,
      description: "",
      timestamp: "",
    },
  ];
  const sellNotifications = [
    {
      token: {
        name: "MOLANDAK",
        address: MOLANDAK_ADDRESS,
        symbol: "DAK",
        decimals: 18,
      },
      amount: 10,
      description: "",
      timestamp: "",
    },
  ];

  const onYes = useCallback(
    async (token: Token, amount: number, type: "buy" | "sell") => {
      if (!address) return;

      const params = new URLSearchParams({
        token: token.symbol,
        amount: amount.toString(),
        type,
        userAddress: address,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trade/0x-quote?${params.toString()}`
      );
      const quote = await res.json();
      console.log(quote);

      if (quote.issues.allowance !== null) {
        try {
          const test = await writeContractAsync({
            abi: erc20Abi,
            address: type === "sell" ? token.address : WMONAD_ADDRESS,
            functionName: "approve",
            args: [
              PERMIT2_ADDRESS,
              parseUnits(amount.toString(), token.decimals),
            ],
          });

          await waitForTransactionReceipt(config, {
            hash: test,
            confirmations: 1,
          });
        } catch (error) {
          console.log("Error approving Permit2:", error);
        }
      }

      const transaction = quote?.transaction;
      const signature = await signTypedDataAsync(quote?.permit2.eip712);
      const signatureLengthInHex = numberToHex(size(signature), {
        signed: false,
        size: 32,
      });
      transaction.data = concat([
        transaction.data,
        signatureLengthInHex,
        signature,
      ]);

      const hash = await sendTransactionAsync({
        account: address,
        gas: !!quote?.transaction.gas
          ? BigInt(quote?.transaction.gas)
          : undefined,
        to: quote?.transaction.to,
        data: quote?.transaction.data,
        chainId: MONAD_CHAIN_ID,
      });

      console.log(hash);
    },
    [address, sendTransactionAsync, signTypedDataAsync]
  );

  return (
    <div>
      <div className="grid grid-cols-2">
        <div>
          {buyNotifications.map((b, i) => (
            <div key={`b-${i}`}>
              <div>
                Buy {b.amount} {b.token.symbol}?
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onYes(b.token, b.amount, "buy")}>
                  Yes
                </Button>
                <Button>No</Button>
              </div>
              <div>{b.description}</div>
              <div>{b.timestamp}</div>
            </div>
          ))}
        </div>
        <div>
          {sellNotifications.map((s, i) => (
            <div key={`s-${i}`}>
              <div>
                Buy {s.amount} {s.token.symbol}?
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onYes(s.token, s.amount, "sell")}>
                  Yes
                </Button>
                <Button>No</Button>
              </div>
              <div>{s.description}</div>
              <div>{s.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
