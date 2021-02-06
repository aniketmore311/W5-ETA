import { ConnectionOptions } from 'typeorm';
import { env } from './env.config';

const sqliteConnectionOptions: ConnectionOptions = {
  type: 'sqlite',
  database: `${env.ROOT_DIR}/database.db`,
  logging: false,
  synchronize: true,
  entities: [`${env.ROOT_DIR}/src/models/entity/**/*.ts`],
  migrations: [`${env.ROOT_DIR}/src/models/migration/**/*.ts`],
};

export const connectionOptions: ConnectionOptions = sqliteConnectionOptions;
