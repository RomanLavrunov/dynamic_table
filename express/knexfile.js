import path from 'path';
import { config } from './src/config/config.js';

export default {
  client: 'mysql2',
  connection: {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.resolve('migrations'),
    seeds: {
      directory: path.resolve('seeds'),
    },
  }
};
