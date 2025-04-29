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
    username: process.env.POSTGRES_USER || 'root',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'user-module',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    dialect: process.env.POSTGRES_DIALECT || 'mysql',
    logging: process.env.POSTGRES_LOGGING === 'true' || false,
    port: process.env.POSTGRES_PORT
      ? parseInt(process.env.POSTGRES_PORT)
      : 5432,
  },
  test: {
    username: process.env.POSTGRES_USER || 'root',
    password: process.env.POSTGRES_PASSWORD || null, // Allow password to be null
    database: process.env.POSTGRES_DB_TEST || 'database_test',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    dialect: process.env.POSTGRES_DIALECT || 'mysql',
    logging: process.env.POSTGRES_LOGGING === 'true' || false,
    port: process.env.POSTGRES_PORT
      ? parseInt(process.env.POSTGRES_PORT)
      : 3306,
  },
  production: {
    username: process.env.POSTGRES_USER || 'root',
    password: process.env.POSTGRES_PASSWORD || null, // Allow password to be null
    database: process.env.POSTGRES_DB || 'user-module',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    dialect: process.env.POSTGRES_DIALECT || 'mysql',
    logging: process.env.POSTGRES_LOGGING === 'true' || false,
    port: process.env.POSTGRES_PORT
      ? parseInt(process.env.POSTGRES_PORT)
      : 3306,
  },
};

export default databaseConfig;
