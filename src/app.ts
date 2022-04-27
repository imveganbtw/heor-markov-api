import express, { Application } from "express";
import winston from "winston";
import expressWinston from "express-winston";
import Router from "./router";
import Config, { Environment, LoggingLevel } from "./config";
import logger from "./logger";
import { markov } from "./services";

const app: Application = express();

app.use(express.json());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format:
      Config.environment !== Environment.Production
        ? winston.format.combine(
            winston.format.cli(),
            winston.format.colorize()
          )
        : winston.format.logstash(),
    meta: Config.loggingLevel === LoggingLevel.Debug, // include metadata in debug mode
    expressFormat: true,
    colorize: Config.environment === Environment.Development, // Colorize in dev mode
  })
);

app.use(Router);

app.listen(Config.http.port, () => {
  logger.info(`HTTP Server listening on port ${Config.http.port}`);
  markov.loadCorpus();
});
