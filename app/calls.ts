const counterContractAddress: `0x${string}` = '0x7B39075D8A3422cdE4661F616D7956Aee0D54310'; // add your contract address here
const counterContractAbi = [
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export const calls = [
  {
    to: counterContractAddress,
    abi: counterContractAbi,
    functionName: 'increment',
    args: [],
  },
];