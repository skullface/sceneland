/** @type {import('next').NextConfig} */
const fs = require('fs');
const lastUpdatedAt = fs.readFileSync('.last-updated', 'utf8');

const nextConfig = {
  output: 'export',
  distDir: 'dist',
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_LAST_UPDATED_AT: lastUpdatedAt,
  },
}

module.exports = nextConfig
