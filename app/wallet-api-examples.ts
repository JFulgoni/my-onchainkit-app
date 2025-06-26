// Examples of Coinbase Wallet API calls using OnchainKit and wagmi

import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect } from 'react';

// Example 1: Basic wallet connection and account info
export function useWalletInfo() {
  const { address, isConnected, chainId } = useAccount();
  const { data: balance } = useBalance({ address });
  
  return {
    address,
    isConnected,
    chainId,
    balance: balance ? {
      formatted: balance.formatted,
      symbol: balance.symbol,
      decimals: balance.decimals,
      value: balance.value
    } : null
  };
}

// Example 2: Contract interaction with transaction tracking
export function useContractInteraction(contractAddress: `0x${string}`, abi: any) {
  const { address } = useAccount();
  const { writeContract, isPending, data: hash } = useWriteContract();
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  
  // Wait for transaction receipt
  const { data: receipt, isSuccess, isError } = useWaitForTransactionReceipt({ hash });
  
  useEffect(() => {
    if (isPending) setTransactionStatus('pending');
    else if (isSuccess) setTransactionStatus('success');
    else if (isError) setTransactionStatus('error');
  }, [isPending, isSuccess, isError]);
  
  const executeTransaction = (functionName: string, args: any[] = []) => {
    if (!address) return;
    
    writeContract({
      address: contractAddress,
      abi,
      functionName,
      args,
    });
  };
  
  return {
    executeTransaction,
    isPending,
    transactionStatus,
    hash,
    receipt,
    isSuccess,
    isError
  };
}

// Example 3: Token balance checking
export function useTokenBalance(tokenAddress: `0x${string}`) {
  const { address } = useAccount();
  const { data: tokenBalance } = useBalance({
    address,
    token: tokenAddress,
  });
  
  return tokenBalance;
}

// Example 4: Multiple contract reads
export function useMultiContractRead(contracts: Array<{
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args?: any[];
}>) {
  const results = contracts.map(contract => 
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: contract.functionName,
      args: contract.args || [],
    })
  );
  
  return results;
}

// Example 5: Batch transaction execution
export function useBatchTransactions() {
  const { address } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [batchResults, setBatchResults] = useState<string[]>([]);
  
  const executeBatch = async (transactions: Array<{
    address: `0x${string}`;
    abi: any;
    functionName: string;
    args?: any[];
  }>) => {
    if (!address) return;
    
    const results: string[] = [];
    
    for (const tx of transactions) {
      try {
        writeContract({
          address: tx.address,
          abi: tx.abi,
          functionName: tx.functionName,
          args: tx.args || [],
        });
        // Note: In wagmi v2, writeContract doesn't return a promise
        // You would need to track the transaction hash differently
        results.push('submitted');
      } catch (error) {
        console.error(`Transaction failed: ${tx.functionName}`, error);
        results.push('failed');
      }
    }
    
    setBatchResults(results);
  };
  
  return {
    executeBatch,
    isPending,
    batchResults
  };
}

// Example 6: Wallet signature
export function useWalletSignature() {
  const { address } = useAccount();
  const [signature, setSignature] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);
  
  const signMessage = async (message: string) => {
    if (!address) return;
    
    setIsSigning(true);
    try {
      // This would require additional setup with wagmi's useSignMessage
      // For now, this is a placeholder showing the concept
      console.log('Signing message:', message);
      setSignature('signature_placeholder');
    } catch (error) {
      console.error('Signature failed:', error);
    } finally {
      setIsSigning(false);
    }
  };
  
  return {
    signMessage,
    signature,
    isSigning
  };
}

// Example 7: Network switching
export function useNetworkSwitching() {
  const { chainId } = useAccount();
  const [targetChainId, setTargetChainId] = useState<number | null>(null);
  
  const switchNetwork = async (newChainId: number) => {
    setTargetChainId(newChainId);
    // This would require additional setup with wagmi's useSwitchChain
    // For now, this is a placeholder showing the concept
    console.log('Switching to chain:', newChainId);
  };
  
  return {
    currentChainId: chainId,
    targetChainId,
    switchNetwork
  };
}

// Example 8: Transaction history tracking
export function useTransactionHistory() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<any[]>([]);
  
  const addTransaction = (tx: any) => {
    setTransactions(prev => [...prev, { ...tx, timestamp: Date.now() }]);
  };
  
  const clearHistory = () => {
    setTransactions([]);
  };
  
  return {
    transactions,
    addTransaction,
    clearHistory
  };
} 