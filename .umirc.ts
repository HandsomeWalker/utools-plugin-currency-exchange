import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
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
