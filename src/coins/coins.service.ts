import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { Coin } from './entities/coin.entity';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coin)
    private coinRepository: Repository<Coin>,
  ) {}

  async create(createCoinDto: CreateCoinDto): Promise<Coin> {
    const coin = this.coinRepository.create({ ...createCoinDto });
    return await this.coinRepository.save(coin);
  }

  async findAll(userId: number): Promise<Coin[]> {
    return await this.coinRepository.find({ order: { name: 'asc' } });
  }

  async findOne(id: number, userId: number): Promise<Coin> {
    const coin = await this.coinRepository.findOne({
      where: { id },
    });

    if (!coin) {
      throw new NotFoundException(
        `Coin with ID ${id} not found or does not belong to user.`,
      );
    }

    return coin;
  }

  async update(
    id: number,
    updateCoinDto: UpdateCoinDto,
    userId: number,
  ): Promise<Coin> {
    const coin = await this.findOne(id, userId);

    Object.assign(coin, updateCoinDto);
    return await this.coinRepository.save(coin);
  }

  async remove(id: number, userId: number): Promise<void> {
    const deleteResult = await this.coinRepository.delete({ id });

    if (!deleteResult.affected) {
      throw new NotFoundException(
        `Coin with ID ${id} not found or does not belong to user.`,
      );
    }
  }
}
