import knex from 'knex';
import { config } from './config/config.js';

const db = knex({
  client: 'mysql2',
  connection: {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  }, pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 60000,
    createTimeoutMillis: 60000,
  }
});

export default db;
