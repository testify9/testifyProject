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
      return require('./cypress/plugins/index.js')(on, config)
    },
    specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './cypress/support/index.ts',
  },
  retries: 5,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000
})
