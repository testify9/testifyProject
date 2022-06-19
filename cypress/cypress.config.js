const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fileServerFolder: '.',
  modifyObstructiveCode: false,
  video: false,
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./plugins/index.js')(on, config)
    },
    specPattern: './e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './support/index.ts',
  },
})
