import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createResponse, ResponseHandler } from 'src/response.handler';
import { LoginInput } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/database/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

config();
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users) private userRepository: Repository<Users>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    /**
     * Login API
     * @param loginInput
     * @returns response
     */
    async login(loginInput: LoginInput): Promise<any> {
        const { email, password } = loginInput;
        const user = await this.userRepository.findOne({ where: { email: email.toLowerCase() } });
        if (!user) throw new NotFoundException("User not found with this email!");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException("Incorrect Password!");

        user['token'] = await this.jwtService.signAsync({
            userId: user.id,
            email: user.email,
            role: user.role
        }, {
            secret: this.configService.get<string>('SECRET_ACCESS_JWT'),
            expiresIn: this.configService.get<string>('TOKEN_EXPIRES_IN')
        });
        delete user.password;

        return createResponse(200, 'You are successfully logged in!', user);
    }

    /**
     * Logout API
     * @param user 
     * @returns response
     */
    async logout(user): Promise<ResponseHandler> {
        return createResponse(200, "You have been successfully logged out!");
    }
}
