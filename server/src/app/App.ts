import { default as http, createServer, Server } from 'http';
import {
  default as express,
  Application,
  NextFunction,
  Request,
  Response,
} from 'express';

import { default as Router } from './router';
import { GlobalMiddleware } from './middleware';
import { IAppError } from './utilities';
import { IConfig } from './services/config';

class App {
  public app: Application;
  private config: IConfig;
  private router: Router;
  private server: Server;

  constructor(config: IConfig) {
    this.config = config;

    this.createExpress();
    this.createServer();
  }

  private createExpress(): void {
    this.app = express();
    GlobalMiddleware.load(this.app, __dirname);
    this.createRouter();
    this.app.use(this.clientErrorHandler);
    this.app.use(this.errorHandler);
  }

  private clientErrorHandler(
    error: IAppError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (req.xhr) {
      res.status(error.status).json({ error });
    }
    next(error);
  }

  private errorHandler(
    error: IAppError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (error.status === 404) {
      res.status(404).render('pages/404');
    } else {
      res.status(error.status).render('pages/404');
    }
  }

  private createServer(): void {
    this.server = createServer(this.app);
    this.server.on('error', (error?: Error) => {
      this.gracefulShutdown(error);
    });
    this.server.on('close', () => {
      console.log('Server is closed!');
    });
    this.server.on('listening', () => {
      console.log(`Server is listening on ${this.config.server.host}:${this.config.server.port}`);
    });
  }

  private createRouter(): void {
    this.router = new Router(this.app);
  }

  public start(): void {
    this.server.listen(this.config.server.port, this.config.server.host);
  }

  public stop(): void {
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
