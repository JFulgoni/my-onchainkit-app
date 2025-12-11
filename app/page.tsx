"use client";

import { useEffect, useState } from 'react';
import { useAccount, useBalance, useWriteContract } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import HeaderWallet from "./components/HeaderWallet";
import MyNameIsComponent from "./components/MyNameIs";
import TransactionSection from "./components/TransactionSection";
import WalletInfoPanel from "./components/WalletInfoPanel";

export default function App() {
  const { address, isConnected } = useAccount();
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [contractValue, setContractValue] = useState<string>("");
  const [coinbaseContractValue, setCoinbaseContractValue] = useState<string>("");
  const [isReading, setIsReading] = useState(false);
  const [isReadingCoinbase, setIsReadingCoinbase] = useState(false);

  // Example of reading contract data
  const { data: balance } = useBalance({
    address,
  });

  // Example of writing to contract
  const { writeContract, isPending, data: writeData } = useWriteContract();

  const handleIncrement = async () => {
    if (!address) return;

    try {
      writeContract({
        address: '0x7B39075D8A3422cdE4661F616D7956Aee0D54310',
        chainId: baseSepolia.id,
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

  const handleReadContract = async () => {
    if (!address) {
      setContractValue('Please connect your wallet first');
      return;
    }

    setIsReading(true);
    setContractValue('Reading...');

    try {
      console.log('Reading contract state...');
      console.log('Contract address:', '0x7B39075D8A3422cdE4661F616D7956Aee0D54310');
      console.log('User address:', address);

      // Use a direct RPC call instead of the hook to avoid repeated calls
      const response = await fetch('https://sepolia.base.org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [
            {
              to: '0x7B39075D8A3422cdE4661F616D7956Aee0D54310',
              data: '0x8381f58a', // function selector for number()
            },
            'latest'
          ],
          id: 1
        })
      });

      const result = await response.json();
      console.log('RPC response:', result);

      if (result.result) {
        // Convert hex to decimal
        const numberValue = parseInt(result.result, 16);
        console.log('Contract number value:', numberValue);
        setContractValue(numberValue.toString());
      } else {
        console.log('No data returned from contract read');
        setContractValue('No data returned');
      }
    } catch (error) {
      console.error('Failed to read contract:', error);
      setContractValue(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsReading(false);
    }
  };

  const handleReadContractCoinbase = async () => {
    if (!address) {
      setCoinbaseContractValue('Please connect your wallet first');
      return;
    }

    setIsReadingCoinbase(true);
    setCoinbaseContractValue('Reading via Coinbase API...');

    try {
      console.log('Reading contract state via Coinbase API...');
      console.log('Contract address:', '0x7B39075D8A3422cdE4661F616D7956Aee0D54310');
      console.log('User address:', address);

      // Check if API key is available
      const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
      if (!apiKey) {
        setCoinbaseContractValue('Error: OnchainKit API key not found. Please add NEXT_PUBLIC_ONCHAINKIT_API_KEY to your .env.local file');
        return;
      }

      console.log('Using API key:', apiKey.substring(0, 10) + '...');

      // Try different Coinbase API endpoint formats
      const endpoints = [
        'https://api.developer.coinbase.com/rpc/v1/base-sepolia/ce5dba14-05b5-4a1c-99b0-14d75c6fc8cf',
        'https://api.developer.coinbase.com/rpc/v1/base-sepolia',
        'https://api.developer.coinbase.com/rpc/v1/base-sepolia/'
      ];

      let response: Response | undefined;
      let workingEndpoint = null;

      for (const endpoint of endpoints) {
        try {
          console.log('Trying endpoint:', endpoint);

          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_call',
              params: [
                {
                  to: '0x7B39075D8A3422cdE4661F616D7956Aee0D54310',
                  data: '0x8381f58a', // function selector for number()
                },
                'latest'
              ],
              id: 1
            })
          });

          console.log(`Endpoint ${endpoint} response status:`, response.status);

          if (response.ok) {
            workingEndpoint = endpoint;
            break;
          } else {
            console.log(`Endpoint ${endpoint} failed with status:`, response.status);
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed with error:`, error);
        }
      }

      if (!workingEndpoint || !response) {
        setCoinbaseContractValue('Error: All Coinbase API endpoints failed. Please check your API key and try again.');
        return;
      }

      console.log('Working endpoint found:', workingEndpoint);
      console.log('Coinbase API response status:', response.status);
      console.log('Coinbase API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Coinbase API error:', errorText);

        if (response.status === 404) {
          setCoinbaseContractValue('Error: 404 - Coinbase API endpoint not found. This might be due to incorrect API key or endpoint URL.');
        } else {
          setCoinbaseContractValue(`Coinbase API Error: ${response.status} - ${errorText}`);
        }
        return;
      }

      const result = await response.json();
      console.log('Coinbase API response:', result);

      if (result.result) {
        // Convert hex to decimal
        const numberValue = parseInt(result.result, 16);
        console.log('Contract number value (Coinbase):', numberValue);
        setCoinbaseContractValue(numberValue.toString());
      } else if (result.error) {
        console.error('Coinbase API returned error:', result.error);
        setCoinbaseContractValue(`API Error: ${result.error.message || 'Unknown error'}`);
      } else {
        console.log('No data returned from Coinbase API');
        setCoinbaseContractValue('No data returned from Coinbase API');
      }
    } catch (error) {
      console.error('Failed to read contract via Coinbase API:', error);
      setCoinbaseContractValue(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsReadingCoinbase(false);
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
      <HeaderWallet />
      <main className="flex flex-grow items-center justify-center">
        <div className="w-full max-w-4xl p-4">
          <TransactionSection />
          <WalletInfoPanel
            address={address ?? ""}
            isConnected={isConnected}
            balance={balance}
            contractValue={contractValue}
            coinbaseContractValue={coinbaseContractValue}
            isReading={isReading}
            isReadingCoinbase={isReadingCoinbase}
            isPending={isPending}
            transactionHash={transactionHash}
            handleReadContract={handleReadContract}
            handleReadContractCoinbase={handleReadContractCoinbase}
            handleIncrement={handleIncrement}
          />
          <MyNameIsComponent />
        </div>
      </main>
    </div>
  );
}
