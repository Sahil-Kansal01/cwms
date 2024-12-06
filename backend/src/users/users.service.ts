import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './database/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createResponse } from 'src/response.handler';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private userRepository: Repository<Users>) { }

    async createUser(createUserInput: CreateUserInput) {
        const { name, email, password, role } = createUserInput;
        const user = new Users();
        user.name = name;
        user.email = email;
        user.role = role;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        user.password = passwordHash;

        await this.userRepository.save(user);
        return createResponse(201, "User created successfully!");
    }

    async findUserByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email: email.toLowerCase() } });
    }
}
