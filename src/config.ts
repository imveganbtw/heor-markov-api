export enum Environment {
  Development = "development",
  Production = "production",
}
export enum LoggingLevel {
  Debug = "debug",
  Info = "info",
}

interface HttpConfigInterface {
  port: number;
}

interface DBConfigInterface {
  connectionString: string;
}

interface MarkovConfigInterface {
  db_name: string;
  collection_name: string;
}

export interface ConfigInterface {
  environment: Environment;
  loggingLevel: LoggingLevel;
  http: HttpConfigInterface;
  db: DBConfigInterface;
  markov: MarkovConfigInterface;
}

class Config implements ConfigInterface {
  environment: Environment;
  loggingLevel: LoggingLevel;
  http: HttpConfigInterface;
  db: DBConfigInterface;
  markov: MarkovConfigInterface;

  constructor() {
    this.environment = Config.getEnvironment();
    this.loggingLevel = Config.getLoggingLevel();
    this.http = Config.getHttpConfig();
    this.db = Config.getDBConfig();
    this.markov = {
      db_name: process.env.MARKOV_DB_NAME as string,
      collection_name: process.env.MARKOV_COLLECTION_NAME as string,
    };
  }

  private static getDBConfig(): DBConfigInterface {
    return {
      connectionString: process.env.MONGODB_CONNECTION_STRING as string,
    };
  }

  private static getHttpConfig(): HttpConfigInterface {
    return {
      port: parseInt(process.env.HTTP_PORT as string, 10) || 3000,
    };
  }

  private static getEnvironment(): Environment {
    switch (process.env.ENVIRONMENT) {
      case "dev":
      case "development":
        return Environment.Development;
      case "prod":
      case "production":
        return Environment.Production;
      default:
        return Environment.Production;
    }
  }

  private static getLoggingLevel(): LoggingLevel {
    switch (process.env.LOGGING_LEVEL) {
      case "debug":
        return LoggingLevel.Debug;
      case "info":
        return LoggingLevel.Info;
      default:
        return LoggingLevel.Info;
    }
  }
}

export default new Config();
