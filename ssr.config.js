module.exports = {
  id: 'default',
  distDir: '.ssr',
  viewsDir: 'views',
  staticViews: [],
  webpack: (config /* webpack.Configuration */, env /* 'development' | 'production' */) => {
    return config;
  },
};
