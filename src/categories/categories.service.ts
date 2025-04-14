import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, // Injeção do repositório User
  ) {}

  // Método para criar uma categoria, associando ao userId
  async create(
    createCategoryDto: CreateCategoryDto,
    userId: number,
  ): Promise<Category> {
    const user = await this.usersRepository.findOne({ where: { id: userId } }); // Buscar a entidade User
    if (!user) {
      throw new Error('User not found'); // Se o usuário não for encontrado, lance um erro
    }

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      user, // Associa a entidade User à categoria
    });

    return this.categoriesRepository.save(category);
  }

  // Método para obter todas as categorias associadas ao userId
  async findAll(userId: number): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { user: { id: userId } },
      order: { description: 'asc' },
    });
  }

  // Método para encontrar uma categoria específica do userId
  async findOne(id: number, userId: number): Promise<Category> {
    return this.categoriesRepository.findOne({
      where: { id, user: { id: userId } }, // Filtra pelo userId
    });
  }

  // Método para atualizar a categoria com base no userId
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ): Promise<Category> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    return await this.categoriesRepository.save({
      id,
      ...updateCategoryDto,
      user: { id: userId },
    });
  }

  // Método para remover uma categoria, filtrando pelo userId
  async remove(id: number, userId: number): Promise<void> {
    await this.categoriesRepository.delete({ id, user: { id: userId } });
  }
}
