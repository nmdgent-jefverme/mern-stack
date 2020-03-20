import { default as dotenv } from 'dotenv';

import { IConfig, Enviroment, IServerConfig, ServerProtocol } from "./config.types";

class Config implements IConfig {
  public docs: boolean;
  public env: Enviroment;
  public server: IServerConfig;
  public mongoDBConnection: string;

  constructor () {
    dotenv.config();
    this.loadEnviromentVariables();
  }

  private loadEnviromentVariables(): void {
    this.docs = Boolean(process.env.NODE_DOCS || false);
    this.env = Enviroment[(process.env.NODE_ENV || Enviroment.development) as keyof typeof Enviroment];
    this.server = {
      host: process.env.NODE_SERVER_HOST || 'localhost',
      port: Number(process.env.NODE_SERVER_PORT) || 8080,
      protocol: ServerProtocol[(process.env.NODE_SERVER_ENV || Enviroment.development) as keyof typeof ServerProtocol],
    } as IServerConfig;
    this.mongoDBConnection = process.env.MONGODB_CONNECTION;
  }
}

export default Config;
