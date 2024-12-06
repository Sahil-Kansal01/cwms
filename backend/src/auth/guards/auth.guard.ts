import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config } from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/database/users.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

config();
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(Users) private userRepository: Repository<Users>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException('Missing Authentication Token!');

        try {
            const { userId, email } = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('SECRET_ACCESS_JWT'),
            });

            const user = await this.userRepository.findOne({ where: { id: userId, email: email.toLowerCase() } });
            if (!user) throw new UnauthorizedException('Unauthorized Access!');

            request['user'] = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized Access!');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
