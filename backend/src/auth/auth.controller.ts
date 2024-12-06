import { Body, Controller, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { ResponseHandler } from 'src/response.handler';
import { CurrentUser } from 'src/users/user.decorator';
import { Users } from 'src/users/database/users.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    /**
     * Login API
     * @param loginInput 
     * @returns response
     */
    @Post('login')
    login(@Body() loginInput: LoginInput): Promise<ResponseHandler> {
        return this.authService.login(loginInput);
    }

    /**
     * Logout API
     * @param client 
     * @returns response
     */
    @Post('logout')
    @UseGuards(AuthGuard)
    logout(@CurrentUser() user: Users): Promise<ResponseHandler> {
        return this.authService.logout(user);
    }
}
