import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173', // или другой порт, если dev-сервер другой
    supportFile: 'cypress/support/e2e.ts'
  },
});
