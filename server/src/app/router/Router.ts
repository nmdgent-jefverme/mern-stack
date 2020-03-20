import { Application, NextFunction, Request, Response } from 'express';

import { FallbackController, HomeController } from '../controllers';
import { default as ApiRouter } from '../api/router';

class Router {
  private app: Application;
  private apiRouter: ApiRouter;
  private homeController: HomeController;
  private fallbackController: FallbackController;

  constructor(app: Application) {
    this.app = app;
    this.apiRouter = new ApiRouter();

    this.registerControllers();
    this.registerRoutes();
  }

  private registerControllers() {
    this.fallbackController = new FallbackController();
    this.homeController = new HomeController();
  }

  private registerRoutes() {
    this.app.route(['/', '/home']).all(this.homeController.index);
    this.app.use('/api', this.apiRouter.router);
    this.app.use('/*', this.fallbackController.index);
  }
}

export default Router;
