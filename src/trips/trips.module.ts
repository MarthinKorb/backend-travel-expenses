import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from 'src/expenses/entities/expense.entity';
import { ExpensesService } from '../../src/expenses/expenses.service';
import { Trip } from './entities/trip.entity';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Trip])],
  controllers: [TripsController],
  providers: [TripsService, ExpensesService],
})
export class TripsModule {}
