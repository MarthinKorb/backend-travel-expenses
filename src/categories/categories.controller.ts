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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    const userId = req.user.id;
    return this.categoriesService.create(createCategoryDto, userId);
  }

  @Get()
  findAll(@Request() req): Promise<Category[]> | undefined {
    const userId = req.user.id;
    return this.categoriesService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<Category | undefined> {
    const userId = req.user.id;
    return this.categoriesService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.categoriesService.update(+id, updateCategoryDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    const userId = req.user.id;
    return this.categoriesService.remove(+id, userId);
  }
}
