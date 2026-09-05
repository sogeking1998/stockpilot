/** @type {import('next').NextConfig} */
const nextConfig = (phase) => ({
  reactStrictMode: true,
  // Keep production builds from overwriting a running dev server's assets.
  distDir: phase === "phase-development-server" ? ".next-dev" : ".next",
});

export default nextConfig;
