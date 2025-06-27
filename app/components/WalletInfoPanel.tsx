"use client";
import React from "react";

interface WalletInfoPanelProps {
  address: string;
  isConnected: boolean;
  balance?: { formatted: string; symbol: string };
  contractValue: string;
  coinbaseContractValue: string;
  isReading: boolean;
  isReadingCoinbase: boolean;
  isPending: boolean;
  transactionHash: string;
  handleReadContract: () => void;
  handleReadContractCoinbase: () => void;
  handleIncrement: () => void;
}

const WalletInfoPanel: React.FC<WalletInfoPanelProps> = ({
  address,
  isConnected,
  balance,
  contractValue,
  coinbaseContractValue,
  isReading,
  isReadingCoinbase,
  isPending,
  transactionHash,
  handleReadContract,
  handleReadContractCoinbase,
  handleIncrement,
}) => {
  if (!isConnected || !address) return null;
  return (
    <div className="text-center mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <p className="text-sm text-gray-600 dark:text-gray-400">Connected Wallet Address:</p>
      <p className="font-mono text-sm break-all">{address}</p>
      {balance && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">Balance:</p>
          <p className="font-mono text-sm">{balance.formatted} {balance.symbol}</p>
        </div>
      )}
      {contractValue && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">Counter Value:</p>
          <p className="font-mono text-sm">{contractValue}</p>
        </div>
      )}
      <button
        onClick={handleReadContract}
        disabled={isReading}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 mr-2"
      >
        {isReading ? 'Reading...' : 'Read Contract State'}
      </button>
      <button
        onClick={handleReadContractCoinbase}
        disabled={isReadingCoinbase}
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
      >
        {isReadingCoinbase ? 'Reading...' : 'Read via Coinbase API'}
      </button>
      {contractValue && (
        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <p className="text-sm text-gray-600 dark:text-gray-400">Direct RPC Result:</p>
          <p className="font-mono text-sm break-all">{contractValue}</p>
        </div>
      )}
      {coinbaseContractValue && (
        <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-purple-600 dark:text-purple-400">Coinbase API Result:</p>
          <p className="font-mono text-sm break-all">{coinbaseContractValue}</p>
        </div>
      )}
      <button
        onClick={handleIncrement}
        disabled={isPending}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isPending ? 'Processing...' : 'Increment Counter'}
      </button>
      {transactionHash && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">Last Transaction:</p>
          <p className="font-mono text-xs break-all">{transactionHash}</p>
        </div>
      )}
    </div>
  );
};

export default WalletInfoPanel; 