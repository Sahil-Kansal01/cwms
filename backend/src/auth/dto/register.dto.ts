import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterInput {
    @IsString()
    @IsNotEmpty({ message: 'Please provide email' })
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    countryCode: string;
}
