import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // @UseGuards(AuthGuard('jwt'))
  // findAll(@Request() req) {
  //   const idUser = req.user.id;
  //   return this.usersService.findAll(idUser);
  // }

  // @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  // findOne(@Request() req, @Param('id') id: string) {
  //   const idUser = Number.parseInt(req.user.id);
  //   return this.usersService.findById(+id, idUser);
  // }

  // @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // @UseGuards(AuthGuard('jwt'))
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
