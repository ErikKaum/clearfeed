/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
    config.experiments = { asyncWebAssembly: true, layers: true }
    config.resolve.fallback = { fs: false };
    return config 
  },
}

module.exports = nextConfig
