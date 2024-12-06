import { Injectable } from '@nestjs/common';
import {
    IsEmpty,
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsDateConstraint implements ValidatorConstraintInterface {
    async validate(date: any, args: ValidationArguments) {
        var regdate = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

        if (date) {
            if (regdate.test(date)) {
                return true;
            } else {
                return false;
            }
        } else if (!IsEmpty(date)) {
            return false;
        } else {
            return true;
        };
    };
};

export function DateFormat(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsDateConstraint,
        });
    };
}