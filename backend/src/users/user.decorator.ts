import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AppDataSource } from 'app-data-source';
import { Users } from './database/users.entity';

const userRepository = AppDataSource.getRepository(Users);

export const CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) throw new UnauthorizedException('Invalid user!');

    const user = await userRepository.findOne({ where: { id: request.user.id } });
    if (!user) throw new UnauthorizedException('No user found!');
    delete user.password;

    return user;
  }
);