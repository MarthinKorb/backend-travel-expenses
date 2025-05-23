import { configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';

configDotenv();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  schema: process.env.DB_SCHEMA || 'public',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/**/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  migrationsRun: true,
  // APenas em PROD
  // ssl: { rejectUnauthorized: true },
});

// npm run build
// npx typeorm-ts-node-commonjs migration:run -d dist/data-source.js

// Rodar migration em dev
// npx typeorm-ts-node-commonjs migration:run -d data-source.ts

// Criação de migrations
// npx typeorm migration:create ./src/infra/database/migrations/CreateInitialSchema
