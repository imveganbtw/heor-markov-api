// configure winston
import winston from "winston";
import { Format } from "logform";
import config, { Environment } from "./config";

const format: Format =
  config.environment === Environment.Development
    ? winston.format.combine(winston.format.cli(), winston.format.colorize())
    : winston.format.logstash();

winston.add(new winston.transports.Console({ format }));
export default winston;
