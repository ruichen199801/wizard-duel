import path from 'path';

module.exports = {
  webpack: {
    alias: {
      '@ai': path.resolve(__dirname, 'src/ai'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
};
