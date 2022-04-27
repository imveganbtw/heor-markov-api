export enum Environment { Development = "development", Production = "production" }
export enum LoggingLevel { Debug = "debug", Info = "info" }

interface HttpConfigInterface {
    port: number;
}

interface DBConfigInterface {
    connectionString: string;
}

export interface ConfigInterface {
    environment: Environment;
    loggingLevel: LoggingLevel;
    http: HttpConfigInterface;
    db: DBConfigInterface;
}

class Config implements ConfigInterface {
    environment: Environment;
    loggingLevel: LoggingLevel;
    http: HttpConfigInterface;
    db: DBConfigInterface;

    constructor() {
        this.environment = this.getEnvironment();
        this.loggingLevel = this.getLoggingLevel();
        this.http = this.getHttpConfig();
        this.db = this.getDBConfig();
    }

    private getDBConfig(): DBConfigInterface {
        return {
            connectionString: process.env.MONGODB_CONNECTION_STRING as string
        }
    }

    private getHttpConfig(): HttpConfigInterface {
        return {
            port: parseInt(process.env.HTTP_PORT as string) || 3000
        }
    }

    private getEnvironment(): Environment {
        switch (process.env.ENVIRONMENT) {
            case "dev":
            case "development":
                return Environment.Development;
                break;
            case "prod":
            case "production":
                return Environment.Production;
                break;
            default:
                return Environment.Production;
        }
    }

    private getLoggingLevel(): LoggingLevel {
        switch (process.env.LOGGING_LEVEL) {
            case "debug":
                return LoggingLevel.Debug;
                break;
            case "info":
                return LoggingLevel.Info;
                break;
            default:
                return LoggingLevel.Info;
        }
    }
}

export const config = new Config(); 