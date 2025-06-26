"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

// MyNameIs contract ABI
const myNameIsAbi = [
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
  },
  {
    type: "function",
    name: "setName",
    stateMutability: "nonpayable",
    inputs: [{ name: "newName", type: "bytes32" }],
    outputs: [],
  },
] as const;

const MYNAMEIS_CONTRACT_ADDRESS = "0x1B3BCC621FBeD6248eD88e1834D77e6d70b13a5d"; // TODO: Replace with actual deployed address

function bytes32ToString(bytes32: string): string {
  try {
    // Remove trailing zeros and decode as UTF-8
    return decodeURIComponent(
      Array.from(
        Buffer.from(bytes32.replace(/^0x/, ""), "hex")
      )
        .map((b) => (b ? String.fromCharCode(b) : ""))
        .join("")
        .replace(/\u0000+$/, "")
    );
  } catch {
    return bytes32;
  }
}

function stringToBytes32(str: string): `0x${string}` {
  const buf = Buffer.alloc(32);
  buf.write(str);
  return ("0x" + buf.toString("hex")) as `0x${string}`;
}

export default function MyNameIsComponent() {
  const { address, isConnected } = useAccount();
  const [inputName, setInputName] = useState("");
  const [displayName, setDisplayName] = useState<string>("");
  const [txStatus, setTxStatus] = useState<string>("");

  // Read contract value
  const { data: nameData, refetch, isLoading: isReading } = useReadContract({
    address: MYNAMEIS_CONTRACT_ADDRESS,
    abi: myNameIsAbi,
    functionName: "name",
  });

  // Write to contract
  const { writeContract, isPending, data: txHash } = useWriteContract();

  useEffect(() => {
    if (nameData) {
      setDisplayName(bytes32ToString(nameData as string));
    }
  }, [nameData]);

  const handleSetName = async () => {
    if (!inputName) return;
    setTxStatus("");
    try {
      writeContract({
        address: MYNAMEIS_CONTRACT_ADDRESS,
        abi: myNameIsAbi,
        functionName: "setName",
        args: [stringToBytes32(inputName)],
      });
      setTxStatus("Transaction submitted");
      setInputName("");
      setTimeout(() => {
        refetch();
      }, 3000); // Refetch after a short delay
    } catch (error) {
      setTxStatus("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 max-w-md mx-auto mt-6">
      <h2 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-300">MyNameIs Contract</h2>
      <div className="mb-2">
        <span className="font-semibold">Current Name:</span>{" "}
        {isReading ? (
          <span>Loading...</span>
        ) : (
          <span className="font-mono">{displayName || "(not set)"}</span>
        )}
      </div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1"
          placeholder="Enter new name"
          value={inputName}
          maxLength={32}
          onChange={(e) => setInputName(e.target.value)}
          disabled={!isConnected || isPending}
        />
        <button
          onClick={handleSetName}
          disabled={!isConnected || isPending || !inputName}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Setting..." : "Set Name"}
        </button>
      </div>
      {txStatus && <div className="text-sm text-blue-700 dark:text-blue-300">{txStatus}</div>}
      {txHash && (
        <div className="text-xs text-gray-500 mt-1 break-all">Tx Hash: {txHash}</div>
      )}
    </div>
  );
} 