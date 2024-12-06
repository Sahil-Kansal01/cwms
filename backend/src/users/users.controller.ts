import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from './user.decorator';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/createUser.dto';
import { Roles } from 'src/auth/role.decorator';
import { UserRole } from './enum/role.enum';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get('profile')
    @UseGuards(AuthGuard)
    getProfile(@CurrentUser() user) {
        return user;
    }

    @Post('create')
    @UseGuards(AuthGuard)
    createUser(@Body() createUserInput: CreateUserInput) {
        return this.userService.createUser(createUserInput);
    }
}
