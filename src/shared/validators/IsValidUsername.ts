import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidUsername', async: false })
export class IsValidUsername implements ValidatorConstraintInterface {
  validate(username: string) {
    const regex = /^[a-z0-9_]+$/;
    return regex.test(username);
  }

  defaultMessage() {
    return 'Username contains invalid characters, spaces, or uppercase letters.';
  }
}
