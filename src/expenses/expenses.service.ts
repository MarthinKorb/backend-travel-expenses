import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toLocalDateOnly } from 'src/shared/date-utils';
import { Trip } from 'src/trips/entities/trip.entity';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: number,
  ): Promise<Expense> {
    await this.validateExpenseDate(createExpenseDto);

    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      user: { id: userId },
    });
    return await this.expenseRepository.save(expense);
  }

  async findAll(userId: number): Promise<Expense[]> {
    return await this.expenseRepository.find({
      where: { user: { id: userId } },
      relations: ['coin', 'category'],
    });
  }

  async findAllByTripId(tripId: number, userId: number): Promise<Expense[]> {
    return await this.expenseRepository.find({
      where: { trip: { id: tripId }, user: { id: userId } },
      relations: ['coin', 'category'],
      order: { date: 'desc' },
    });
  }

  async findOne(id: number, userId: number): Promise<Expense> {
    return await this.expenseRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['coin', 'category'],
    });
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
    userId: number,
  ): Promise<Expense> {
    const expense = await this.findOne(id, userId);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    await this.validateExpenseDate(updateExpenseDto);
    await this.expenseRepository.update(id, updateExpenseDto);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const expense = await this.findOne(id, userId);
    if (!expense) {
      throw new NotFoundException('Despensa não encontrada');
    }
    await this.expenseRepository.delete({ id, user: { id: userId } });
  }

  private async validateExpenseDate(
    expense: CreateExpenseDto | UpdateExpenseDto,
  ) {
    const trip = await this.tripRepository.findOne({
      where: { id: expense.trip.id },
    });

    if (!trip) {
      throw new NotFoundException('Viagem não encontrada');
    }

    const expenseDate = toLocalDateOnly(expense.date);
    const tripStart = toLocalDateOnly(trip.startDate);
    const tripEnd = toLocalDateOnly(trip.endDate);

    console.log(expense.date);
    console.log(trip.startDate);
    console.log(trip.endDate);

    if (expenseDate > tripEnd) {
      throw new BadRequestException(
        'A data da despesa não pode ser posterior ao fim da viagem',
      );
    }

    if (expenseDate < tripStart) {
      throw new BadRequestException(
        'A data da despesa não pode ser anterior ao início da viagem',
      );
    }
  }
}
