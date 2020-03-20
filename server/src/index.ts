import { default as App } from './app';

import { default as Config, IConfig } from './app/services/config';


(() => {
  // create a config service
  const config: IConfig = new Config();

  const app: App = new App(config);
  app.start();

  const stopAllProcesses = () => {
    app.stop();

    console.log('Stopped all processes');
  };

  process.on('SIGINT', () => stopAllProcesses());
  process.on('SIGTERM', () => stopAllProcesses());
})(); // IIFE
