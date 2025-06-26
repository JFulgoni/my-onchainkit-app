/** @type {import('next').NextConfig} */
const nextConfig = {
    // Silence warnings
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
    webpack: (config) => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      return config;
    },
    output: 'export',
    basePath: '/my-onchainkit-app',
    assetPrefix: '/my-onchainkit-app/',
  };
  
  export default nextConfig;
  