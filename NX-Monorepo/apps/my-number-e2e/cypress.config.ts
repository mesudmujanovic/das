import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run my-number:serve:development',
        production: 'nx run my-number:serve:production',
      },
      ciWebServerCommand: 'nx run my-number:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
