import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInput {
    @IsString()
    @IsNotEmpty({ message: 'Please provide email!' })
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
