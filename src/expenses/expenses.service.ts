import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncomeOutcomeType } from '../enums/income-outcome-type-enum';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseResumeByCategoryDto } from './dto/expense-resume-by-category.dto';
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
    return await this.expenseRepository.save({
      id,
      ...updateExpenseDto,
      user: { id: userId },
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    const expense = await this.findOne(id, userId);
    if (!expense) {
      throw new NotFoundException('Despensa não encontrada');
    }
    await this.expenseRepository.delete({ id, user: { id: userId } });
  }

  async getExpenseSummaryByCategory(
    userId: number,
    tripId: number,
  ): Promise<any> {
    const result = await this.expenseRepository
      .createQueryBuilder('expense')
      .innerJoin('expense.category', 'category')
      .select('category.id', 'id')
      .addSelect('category.description', 'description')
      .addSelect('category.type', 'type')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.trip_id = :tripId', { tripId })
      .andWhere('expense.user_id = :userId', { userId })
      .groupBy('category.id')
      .orderBy('total', 'DESC')
      .addOrderBy('category.description', 'ASC')
      .getRawMany();

    const [totalAmountIncomes, totalAmountOutcomes] = result.reduce(
      (acc, curr) => {
        if (curr.type === IncomeOutcomeType.INCOME) {
          acc[0] += parseFloat(curr.total);
        } else if (curr.type === IncomeOutcomeType.OUTCOME) {
          acc[1] += parseFloat(curr.total);
        }
        return acc;
      },
      [0, 0],
    );

    const incomes = result
      .filter((item) => item.type === IncomeOutcomeType.INCOME)
      .map<ExpenseResumeByCategoryDto>((item) => ({
        category: item.description,
        total: parseFloat(item.total),
        type: item.type,
        percentage: parseFloat(
          ((parseFloat(item.total) / totalAmountIncomes) * 100).toFixed(2),
        ),
      }));

    const outcomes = result
      .filter((item) => item.type === IncomeOutcomeType.OUTCOME)
      .map<ExpenseResumeByCategoryDto>((item) => ({
        category: item.description,
        total: parseFloat(item.total),
        type: item.type,
        percentage: parseFloat(
          ((parseFloat(item.total) / totalAmountOutcomes) * 100).toFixed(2),
        ),
      }));

    return { incomes, outcomes, totalAmountIncomes, totalAmountOutcomes };
  }
}
