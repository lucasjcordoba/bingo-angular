
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1386, hash: '5fa6b362f75c43312d7c058044e6919a623e60c00f46ac94d19e699dd8e665a4', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 898, hash: '2fa32f67e3156f61451b7576eaeaa705d0550ea0b665026d47a3763a88e4fa16', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 22446, hash: '57dc37ed20d5f2723e59ee4638e9d3d2e95b7055ff7e0065619421b9149042e8', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-QRJMQ5FR.css': {size: 9577, hash: 'A1J7Vt5R3Ro', text: () => import('./assets-chunks/styles-QRJMQ5FR_css.mjs').then(m => m.default)}
  },
};
