import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Método para encontrar um usuário pelo email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      select: { password: true, email: true, name: true, id: true },
    });
  }

  // Método para encontrar um usuário pelo id
  async findById(id: number, idUser: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user || user.id != idUser) return null;
    return user;
  }

  // Método para encontrar todos os usuários
  async findAll(idUser: number): Promise<User[]> {
    return this.usersRepository.find({ where: { id: idUser } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('E-mail já cadastrado');
    }
    if (!userData.name || userData.name.trim() === '') {
      throw new Error('Nome é obrigatório');
    }
    if (!userData.email || userData.email.trim() === '') {
      throw new Error('E-mail é obrigatório');
    }
    if (!userData.password || userData.password.trim() === '') {
      throw new Error('Senha é obrigatória');
    }
    if (userData.password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    userData.password = hashedPassword;
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  // Método para atualizar um usuário
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne({ where: { id } });
  }

  // Método para remover um usuário
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
