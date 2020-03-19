import App from './app';

(async () => {
  const app: App = new App();
  app.start();

  const stopAllProcesses = () => {
    app.stop();

    console.log('Stopped all processess');
    
  }

   process.on('SIGINT', () => stopAllProcesses())
   process.on('SIGTERM', () => stopAllProcesses())
})();