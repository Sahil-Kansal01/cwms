import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/database/users.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/users/enum/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        @InjectRepository(Users) private userRepository: Repository<Users>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private reflector: Reflector
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

            const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
            if (requiredRoles && !requiredRoles.includes(user.role)) throw new ForbiddenException('Insufficient permissions!');

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
