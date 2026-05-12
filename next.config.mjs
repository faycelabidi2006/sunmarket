/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // ✅ أضف هذا
  trailingSlash: true,     // ✅ أضف هذا
  images: {
    unoptimized: true,     // ✅ مطلوب مع static export
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ]
  },
}

export default nextConfig