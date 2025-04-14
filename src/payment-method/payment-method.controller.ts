import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodService } from './payment-method.service';

@Controller('payment-methods')
@UseGuards(AuthGuard('jwt'))
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  create(
    @Request() req,
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ) {
    return this.paymentMethodService.create(
      req.user.id,
      createPaymentMethodDto,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.paymentMethodService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.paymentMethodService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodService.update(
      req.user.id,
      +id,
      updatePaymentMethodDto,
    );
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.paymentMethodService.remove(+id, req.user.id);
  }
}
