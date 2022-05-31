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
    chrome: 98,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },
});
