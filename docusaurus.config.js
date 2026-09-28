// docusaurus.config.js
/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: 'SmartForm + Docusaurus',
  url: 'https://smartform-example-docusaurus.netlify.app',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  smartformFormId: 'f_replace_me',     // <-- replace with your real form ID
  presets: [['@docusaurus/preset-classic', { docs: { sidebarPath: false } }]],
  themeConfig: {},
};
