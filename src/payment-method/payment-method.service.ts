import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async create(userId: number, createPaymentMethodDto: CreatePaymentMethodDto) {
    const paymentMethod = this.paymentMethodRepository.create({
      ...createPaymentMethodDto,
      user: { id: userId },
    });
    return await this.paymentMethodRepository.save(paymentMethod);
  }

  findAll(userId: number) {
    return this.paymentMethodRepository.find({
      where: { user: { id: userId } },
    });
  }

  findOne(id: number, userId: number) {
    return this.paymentMethodRepository.findOne({
      where: { id, user: { id: userId } },
    });
  }

  update(
    userId: number,
    id: number,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    const paymentMethod = this.paymentMethodRepository.findOneBy({ id });
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }
    return this.paymentMethodRepository.update(id, {
      ...updatePaymentMethodDto,
      user: { id: userId },
    });
  }

  remove(id: number, userId: number) {
    const paymentMethod = this.paymentMethodRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }
    return this.paymentMethodRepository.delete({ id, user: { id: userId } });
  }
}
