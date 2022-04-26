import express, { Application } from "express";
import winston from "winston";
import expressWinston from "express-winston";
import Router from "./router";
import { config as Config, Environment, LoggingLevel } from "./config";
import logger from "./logger";


const PORT = process.env.PORT || 8000;
const ENV = process.env.NODE_ENV || 'dev';
const DEBUG = !!process.env.NODE_DEBUG || false;
const app: Application = express();

app.use(express.json());
app.use(expressWinston.logger({
    transports: [ new winston.transports.Console() ],
    format: (true) ? winston.format.combine(winston.format.cli(), winston.format.colorize()) : winston.format.logstash(),
    meta: (Config.loggingLevel === LoggingLevel.Debug), // include metadata in debug mode
    expressFormat: true,
    colorize: (Config.environment === Environment.Development), // Colorize in dev mode
  }));

app.use(Router);

app.listen(Config.http.port, () => {
    logger.info(`HTTP Server listening on port ${Config.http.port}`);
});