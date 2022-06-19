/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
 module.exports = (on, config) => {

    require('dotenv').config({ path: '../.env' });

    if (config.env.auth0_username === undefined) {
      config.env.auth0_username = process.env.CMS_AUTH0_E2E_USERNAME;
      config.env.auth0_password = process.env.CMS_AUTH0_E2E_PASSWORD;
    }

    return config;
  };