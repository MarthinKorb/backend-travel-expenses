import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll(userId: number): Promise<Trip[]> {
    console.log(userId);
    return await this.tripRepository.find({
      where: { user: { id: userId } },
      order: { startDate: 'desc' },
    });
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
      throw new NotFoundException(`Trip with ID ${id} not found`);
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
