import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  export function Match(property: string, validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
      registerDecorator({
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: [property],
        validator: MatchConstraint,
      });
    };
  }
  
  @ValidatorConstraint({ name: 'Match' })
  export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
      const [relatedPropertyName] = args.constraints;
      const relatedValue = (args.object as object)[relatedPropertyName];
      return value === relatedValue;
    }
  }
  