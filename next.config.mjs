/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
    // Silence warnings
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
    webpack: (config) => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      return config;
    },
    output: 'export',
    ...(isProd ? {
      basePath: '/my-onchainkit-app',
      assetPrefix: '/my-onchainkit-app/',
    } : {}),
    images: {
      unoptimized: true,
    }
  };
  
  export default nextConfig;
  