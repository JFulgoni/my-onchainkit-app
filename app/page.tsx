"use client";

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { Transaction } from '@coinbase/onchainkit/transaction';
import { useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi';
import { calls } from './calls';
import { useState, useEffect } from 'react';

export default function App() {
  const { address, isConnected } = useAccount();
  const [transactionHash, setTransactionHash] = useState<string>('');

  // Example of reading contract data
  const { data: balance } = useBalance({
    address,
  });

  // Example of reading contract state
  const { data: contractData } = useReadContract({
    address: '0x7B39075D8A3422cdE4661F616D7956Aee0D54310',
    abi: [
      {
        type: 'function',
        name: 'number',
        inputs: [],
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'number',
  });

  // Example of writing to contract
  const { writeContract, isPending, data: writeData } = useWriteContract();

  const handleIncrement = async () => {
    if (!address) return;
    
    try {
      writeContract({
        address: '0x7B39075D8A3422cdE4661F616D7956Aee0D54310',
        abi: [
          {
            type: 'function',
            name: 'increment',
            inputs: [],
            outputs: [],
            stateMutability: 'nonpayable',
          },
        ],
        functionName: 'increment',
      });
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  // Update transaction hash when writeData changes
  useEffect(() => {
    if (writeData) {
      setTransactionHash(writeData);
    }
  }, [writeData]);

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      <header className="pt-4 pr-4">
        <div className="flex justify-end">
          <div className="wallet-container">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </header>
      <main className="flex flex-grow items-center justify-center">
        <div className="w-full max-w-4xl p-4">
          <div className="mx-auto mb-6 w-1/3">
            <Transaction 
              calls={calls} 
            />
          </div>
          
          {/* Display wallet information */}
          {isConnected && address && (
            <div className="text-center mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Connected Wallet Address:</p>
              <p className="font-mono text-sm break-all">{address}</p>
              
              {/* Display balance */}
              {balance && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Balance:</p>
                  <p className="font-mono text-sm">{balance.formatted} {balance.symbol}</p>
                </div>
              )}
              
              {/* Display contract data */}
              {contractData && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Counter Value:</p>
                  <p className="font-mono text-sm">{contractData.toString()}</p>
                </div>
              )}
              
              {/* Manual increment button */}
              <button
                onClick={handleIncrement}
                disabled={isPending}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isPending ? 'Processing...' : 'Increment Counter'}
              </button>
              
              {/* Display transaction hash */}
              {transactionHash && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Transaction:</p>
                  <p className="font-mono text-xs break-all">{transactionHash}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
