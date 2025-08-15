const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://musifyfe4dotnet-b7gbb4d4g6dfc7a0.eastus2-01.azurewebsites.net',
    env: {
      LOGIN_TIMEOUT: 10000,
      apiUrl: 'https://musify-etcdbtepfcgbeea5.eastus2-01.azurewebsites.net'
    },
     reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,
      json: true
    },
    setupNodeEvents(on, config) {    },
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: false,
    screenshotsFolder: false,
    testIsolation: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
  }
});
