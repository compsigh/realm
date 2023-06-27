/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    mdxRs: true
  }
}

const withMDX = require('@next/mdx')()
module.exports = withMDX(nextConfig)
