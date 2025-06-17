/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドのビルドでは、これらのモジュールを空のオブジェクトとして扱う
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        sqlite3: false,
      }
    }
    return config
  },
  typescript: {
    // ビルド時のTypeScriptエラーを無視
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig 