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
import { CoinsService } from './coins.service';
import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';

@Controller('coins')
@UseGuards(AuthGuard('jwt'))
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Post()
  create(@Request() req, @Body() createCoinDto: CreateCoinDto) {
    return this.coinsService.create(createCoinDto);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.id;
    return this.coinsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.coinsService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCoinDto: UpdateCoinDto,
  ) {
    const userId = req.user.id;
    return this.coinsService.update(+id, updateCoinDto, userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.coinsService.remove(+id, userId);
  }
}
