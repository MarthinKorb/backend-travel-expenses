import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../data-source';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { CoinsModule } from './coins/coins.module';
import { ExpensesModule } from './expenses/expenses.module';
import { TripsModule } from './trips/trips.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Configuração global
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    CategoriesModule,
    ExpensesModule,
    CoinsModule,
    TripsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
