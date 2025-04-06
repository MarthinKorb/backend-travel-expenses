import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: number,
  ): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      user: { id: userId },
    });
    return await this.expenseRepository.save(expense);
  }

  async findAll(userId: number): Promise<Expense[]> {
    return await this.expenseRepository.find({
      where: { user: { id: userId } },
      relations: ['coin', 'category', 'paymentMethod'],
    });
  }

  async findAllByTripId(tripId: number, userId: number): Promise<Expense[]> {
    return await this.expenseRepository.find({
      where: { trip: { id: tripId }, user: { id: userId } },
      relations: ['coin', 'category', 'paymentMethod'],
      order: { date: 'desc' },
    });
  }

  async findOne(id: number, userId: number): Promise<Expense> {
    return await this.expenseRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['coin', 'category', 'paymentMethod'],
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
}
