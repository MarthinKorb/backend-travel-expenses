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
import { ExpensesService } from '../../src/expenses/expenses.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripsService } from './trips.service';

@Controller('trips')
@UseGuards(AuthGuard('jwt'))
export class TripsController {
  constructor(
    private readonly tripsService: TripsService,
    private readonly expensesService: ExpensesService,
  ) {}

  @Post()
  create(@Request() req, @Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto, req.user.id as number);
  }

  @Get()
  findAll(@Request() req) {
    return this.tripsService.findAll(req.user.id);
  }

  @Get('/:tripId/expenses')
  findAllByTrip(@Request() req, @Param('tripId') tripId: number) {
    return this.expensesService.findAllByTripId(tripId, req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.tripsService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    return this.tripsService.update(+id, updateTripDto, req.user.id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.tripsService.remove(+id, req.user.id);
  }
}
