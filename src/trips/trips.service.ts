import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paginated } from 'src/shared/pagination/paginate';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../src/shared/pagination/pagination-query.dto';
import { IncomeOutcomeType } from '../enums/income-outcome-type-enum';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Trip } from './entities/trip.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async create(createTripDto: CreateTripDto, userId: number): Promise<Trip> {
    const trip = this.tripRepository.create({
      ...createTripDto,
      user: { id: userId },
    });
    return await this.tripRepository.save(trip);
  }

  async findAll(
    userId: number,
    pagination: PaginationQueryDto,
  ): Promise<Paginated<Trip>> {
    const page = +pagination.page || 1;
    const limit = +pagination.limit || 10;
    const offset = (page - 1) * limit;

    const tripIdsQb = this.tripRepository
      .createQueryBuilder('trip')
      .select('trip.id')
      .where('trip.user_id = :userId', { userId })
      .orderBy('trip.startDate', 'DESC')
      .skip(offset)
      .take(limit);

    const tripIds = await tripIdsQb.getRawMany();

    const ids = tripIds.map((row) => row.trip_id || row.id);

    if (ids.length === 0) {
      return {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 0,
          currentPage: page,
        },
        links: {
          first: `${process.env.BASE_URL}?page=1&limit=${limit}`,
          previous: null,
          next: null,
          last: `${process.env.BASE_URL}?page=1&limit=${limit}`,
        },
      };
    }

    const tripsQb = this.tripRepository
      .createQueryBuilder('trip')
      .leftJoin('trip.expenses', 'expense')
      .leftJoin('expense.category', 'category')
      .select('trip.id', 'id')
      .addSelect('trip.name', 'name')
      .addSelect('trip.startDate', 'startDate')
      .addSelect('trip.endDate', 'endDate')
      .addSelect('trip.status', 'status')
      .addSelect(
        'SUM(CASE WHEN category.type = :outcomeType THEN expense.amount ELSE 0 END)',
        'totalExpenses',
      )
      .addSelect(
        'SUM(CASE WHEN category.type = :incomeType THEN expense.amount ELSE 0 END)',
        'totalIncomes',
      )
      .where('trip.id IN (:...ids)', { ids })
      .setParameter('outcomeType', IncomeOutcomeType.OUTCOME)
      .setParameter('incomeType', IncomeOutcomeType.INCOME)
      .groupBy('trip.id')
      .addGroupBy('trip.name')
      .addGroupBy('trip.startDate')
      .addGroupBy('trip.endDate')
      .addGroupBy('trip.status')
      .orderBy('trip.startDate', 'DESC');

    const items = await tripsQb.getRawMany();

    // Total de registros (sem paginação)
    const totalItemsResult = await this.tripRepository
      .createQueryBuilder('trip')
      .where('trip.user_id = :userId', { userId })
      .getCount();

    const totalPages = Math.ceil(totalItemsResult / limit);

    const links = {
      first: `${process.env.BASE_URL}?page=1&limit=${limit}`,
      previous:
        page > 1
          ? `${process.env.BASE_URL}?page=${page - 1}&limit=${limit}`
          : null,
      next:
        page < totalPages
          ? `${process.env.BASE_URL}?page=${page + 1}&limit=${limit}`
          : null,
      last: `${process.env.BASE_URL}?page=${totalPages}&limit=${limit}`,
    };

    return {
      items,
      meta: {
        totalItems: totalItemsResult,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
      links,
    };
  }

  async findOne(id: number, userId: number): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return trip;
  }

  async update(
    id: number,
    updateTripDto: UpdateTripDto,
    userId: number,
  ): Promise<Trip> {
    const updatedTrip = await this.tripRepository.preload({
      id,
      ...updateTripDto,
      user: {
        id: userId,
      },
    });

    if (!updatedTrip) {
      throw new NotFoundException(`Registro ${id} não encontrado`);
    }

    return await this.tripRepository.save(updatedTrip);
  }

  async remove(id: number, userId: number): Promise<void> {
    const deleteResult = await this.tripRepository.delete({
      id,
      user: { id: userId },
    });
    if (!deleteResult.affected) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
  }
}
