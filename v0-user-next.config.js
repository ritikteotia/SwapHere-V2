/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://203.161.39.224:5050",
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      process.env.GOOGLE_CLIENT_ID || "742482579242-ii4ls7bhn45uut4pkcdvsa5fi7f0tk00.apps.googleusercontent.com",
  },
  images: {
    domains: ["placeholder.svg", "localhost", "203.161.39.224"],
  },
}

module.exports = nextConfig
