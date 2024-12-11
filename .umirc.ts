import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  publicPath: './',
  mpa: {},
  ignoreMomentLocale: true,
  targets: {
    chrome: 108,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },
  copy: ['src/styles/antd.dark.min.css', 'plugin.json', 'logo.png'],
});
