require('dotenv').config();

interface DbConfig {
  username: string | null;
  password: string | null;
  database: string;
  host: string;
  dialect: string;
  logging: boolean;
  port: number;
}

interface Config {
  development: DbConfig;
  test: DbConfig;
  production: DbConfig;
}

const databaseConfig: Config = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'user-module',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.DB_LOGGING === 'true' || false,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null, // Allow password to be null
    database: process.env.DB_NAME_TEST || 'database_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.DB_LOGGING === 'true' || false,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  },
  production: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null, // Allow password to be null
    database: process.env.DB_NAME || 'user-module',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.DB_LOGGING === 'true' || false,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  },
};

export default databaseConfig;
