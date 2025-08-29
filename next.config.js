/** @type {import('next').NextConfig} */
const fs = require('fs');
const path = require('path');

// Try to read the last-updated file, fallback to current date if it doesn't exist
let lastUpdatedAt = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
try {
  const lastUpdatedPath = path.join(process.cwd(), '.last-updated');
  if (fs.existsSync(lastUpdatedPath)) {
    lastUpdatedAt = fs.readFileSync(lastUpdatedPath, 'utf8');
  }
} catch (error) {
  console.warn('Could not read .last-updated file, using current date');
}

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_LAST_UPDATED_AT: lastUpdatedAt,
  },
  // Enable static generation
  experimental: {
    optimizePackageImports: ['@radix-ui/react-dropdown-menu'],
  },
}

module.exports = nextConfig
