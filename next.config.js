const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false, // Bỏ qua điều kiện tắt trong môi trường phát triển
});

const withSvgr = require('@svgr/webpack');

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
});
