"use client";
import { Transaction } from "@coinbase/onchainkit/transaction";
import { calls } from "../calls";

export default function TransactionSection() {
  return (
    <div className="mx-auto mb-6 w-1/3">
      <Transaction calls={calls} />
    </div>
  );
} 