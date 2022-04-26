import winston from "winston";
import { config, Environment } from "./config";

const logger = winston.createLogger({
    level: config.loggingLevel,
    format: winston.format.json(),
});

const format = (config.environment === Environment.Development) 
                    ? winston.format.combine(winston.format.cli(), winston.format.colorize()) 
                    : winston.format.logstash();
logger.add(new winston.transports.Console({format: format}));

export default logger;