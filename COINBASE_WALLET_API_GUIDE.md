# Coinbase Wallet API Integration Guide

This guide shows you how to call the Coinbase Wallet API in your OnchainKit project using wagmi hooks.

## Overview

Your project is already set up with:
- **OnchainKit**: Coinbase's React library for wallet integration
- **wagmi**: React hooks for Ethereum
- **Base Sepolia**: Test network configuration

## Basic Wallet Operations

### 1. Connect Wallet
The wallet connection is handled automatically by OnchainKit components:

```tsx
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";

<Wallet>
  <ConnectWallet>
    <Avatar className="h-6 w-6" />
    <Name />
  </ConnectWallet>
</Wallet>
```

### 2. Get Account Information
```tsx
import { useAccount, useBalance } from 'wagmi';

function MyComponent() {
  const { address, isConnected, chainId } = useAccount();
  const { data: balance } = useBalance({ address });
  
  return (
    <div>
      {isConnected && (
        <p>Address: {address}</p>
        <p>Balance: {balance?.formatted} {balance?.symbol}</p>
      )}
    </div>
  );
}
```

## Contract Interactions

### 3. Read Contract Data
```tsx
import { useReadContract } from 'wagmi';

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
```

### 4. Write to Contract
```tsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

function MyComponent() {
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { data: receipt, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleTransaction = () => {
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
  };

  return (
    <button onClick={handleTransaction} disabled={isPending}>
      {isPending ? 'Processing...' : 'Increment'}
    </button>
  );
}
```

## Advanced API Calls

### 5. Token Balance Checking
```tsx
import { useBalance } from 'wagmi';

const tokenBalance = useBalance({
  address,
  token: '0x...', // ERC-20 token address
});
```

### 6. Multiple Contract Reads
```tsx
import { useMultiContractRead } from './wallet-api-examples';

const contracts = [
  {
    address: '0x...',
    abi: [...],
    functionName: 'balanceOf',
    args: [address],
  },
  {
    address: '0x...',
    abi: [...],
    functionName: 'totalSupply',
  },
];

const results = useMultiContractRead(contracts);
```

### 7. Transaction History
```tsx
import { useTransactionHistory } from './wallet-api-examples';

const { transactions, addTransaction, clearHistory } = useTransactionHistory();
```

## Using the Transaction Component

OnchainKit provides a pre-built `Transaction` component:

```tsx
import { Transaction } from '@coinbase/onchainkit/transaction';
import { calls } from './calls';

<Transaction calls={calls} />
```

The `calls.ts` file defines your transactions:

```tsx
export const calls = [
  {
    to: '0x7B39075D8A3422cdE4661F616D7956Aee0D54310',
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
    args: [],
  },
];
```

## Environment Setup

Make sure you have your API key in `.env.local`:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
```

## Available Hooks

### Core wagmi Hooks
- `useAccount()` - Get connected account info
- `useBalance()` - Get ETH or token balance
- `useReadContract()` - Read contract data
- `useWriteContract()` - Write to contracts
- `useWaitForTransactionReceipt()` - Wait for transaction confirmation

### OnchainKit Components
- `ConnectWallet` - Connect button
- `Wallet` - Wallet container
- `WalletDropdown` - Wallet menu
- `Identity` - Display user info
- `Transaction` - Execute transactions

## Error Handling

Always wrap your API calls in try-catch blocks:

```tsx
const handleTransaction = async () => {
  try {
    writeContract({
      // ... transaction config
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    // Handle error (show toast, etc.)
  }
};
```

## Best Practices

1. **Check Connection**: Always verify `isConnected` before making API calls
2. **Loading States**: Use `isPending` to show loading indicators
3. **Error Handling**: Implement proper error handling for all API calls
4. **Transaction Tracking**: Use `useWaitForTransactionReceipt` to track transaction status
5. **User Feedback**: Provide clear feedback for all wallet operations

## Testing

Your project includes a Counter contract for testing. Deploy it to Base Sepolia and update the contract address in `calls.ts`.

## Resources

- [OnchainKit Documentation](https://onchainkit.com/)
- [wagmi Documentation](https://wagmi.sh/)
- [Coinbase Wallet Developer Docs](https://docs.cloud.coinbase.com/wallet-sdk/docs/)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet) 