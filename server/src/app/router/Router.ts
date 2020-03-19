import { Application, NextFunction, Request, Response } from "express";

import { HomeController, FallbackController } from '../controllers';

class Router {
  private app: Application;
  private FallbackController: FallbackController;
  private HomeController: HomeController;

  constructor (app: Application) {
    this.app = app;

    this.registerControllers();
    this.registerRoutes();
  }

  private registerControllers() {
    this.FallbackController = new FallbackController();
    this.HomeController = new HomeController();
  }

  private registerRoutes () {
    this.app.route(['/', '/home']).all(this.HomeController.index);
    this.app.use('/*', this.FallbackController.index);
  }
}

export default Router;