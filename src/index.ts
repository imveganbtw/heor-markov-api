import express, { Application } from "express";
import winston from "winston";
import expressWinston from "express-winston";
import Router from "./router";
import { config, Environment, LoggingLevel } from "./config";
import logger from "./logger";
import markov from "./markov";

const app: Application = express();

app.use(express.json());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format:
      config.environment !== Environment.Production
        ? winston.format.combine(
            winston.format.cli(),
            winston.format.colorize()
          )
        : winston.format.logstash(),
    meta: config.loggingLevel === LoggingLevel.Debug, // include metadata in debug mode
    expressFormat: true,
    colorize: config.environment === Environment.Development, // Colorize in dev mode
  })
);

app.use(Router);

app.listen(config.http.port, () => {
  logger.info(`HTTP Server listening on port ${config.http.port}`);
});

markov.loadCorpus();
