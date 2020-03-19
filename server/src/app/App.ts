import { default as http, createServer, Server } from 'http';
import { default as express, Application, NextFunction, Request, Response } from 'express';

import { default as Router } from './router';
import { GlobalMiddleware } from './middleware';

class App {
  public app: Application;
  private server: Server;
  private router: Router;

  constructor () {
    this.createExpress();
    this.createServer();
  }

  private createExpress (): void {
    this.app = express();
    GlobalMiddleware.load(this.app, __dirname);
    this.createRouter();
    this.app.use(this.clientErrorHandler);
    this.app.use(this.errorHandler);
  }

  private clientErrorHandler (error: Error, req: Request, res: Response, next: NextFunction): void {
    if (req.xhr) {
      res.status(404).json({ error });
    }
    next(error);
  }

  private errorHandler (error: Error, req: Request, res: Response, next: NextFunction): void {
    if (error['status'] === 404) {
      res.status(404).render('pages/404');
    } else {
      res.status(500).json({ message: '500'});
    }
  }

  private createServer (): void {
    this.server = createServer(this.app);
    this.server.on('error', (error?: Error) => {
      this.gracefulShutdown(error);
    });
    this.server.on('listening', () => {
      console.log(`Server is listening on localhost:8080`);
    });
  }

  private createRouter (): void {
    this.router = new Router(this.app);
  }

  public start (): void {
    this.server.listen(8080, 'localhost');
  }

  public stop (): void {
    this.server.close((error?: Error) => {
      this.gracefulShutdown(error);
    });
  }

  private gracefulShutdown(error?: Error): void {
    if (error) {
      process.exit(1);
    }
    process.exit();
  }
}

export default App;