import { IsString, MinLength, MaxLength, Matches, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Custom validator for no character repetition
@ValidatorConstraint({ name: 'noRepetition', async: false })
class NoRepetitionConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    return !/(.)\1{2,}/.test(password);
  }
  defaultMessage(args: ValidationArguments) {
    return 'Password must not contain character repetition (aaa, 111)';
  }
}

// Custom validator for no number sequence
@ValidatorConstraint({ name: 'noNumberSequence', async: false })
class NoNumberSequenceConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    const sequences = ['0123456789', '9876543210'];
    return !sequences.some((seq) =>
      Array.from({ length: password.length - 2 }, (_, i) => password.slice(i, i + 3)).some(
        (chunk) => seq.includes(chunk)
      )
    );
  }
  defaultMessage(args: ValidationArguments) {
    return 'Password must not contain number sequences (123, 789)';
  }
}

// Custom validator for no letter sequence
@ValidatorConstraint({ name: 'noLetterSequence', async: false })
class NoLetterSequenceConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return ![lower, upper, lower.split('').reverse().join(''), upper.split('').reverse().join('')].some(
      (seq) =>
        Array.from({ length: password.length - 2 }, (_, i) => password.slice(i, i + 3)).some((chunk) =>
          seq.includes(chunk)
        )
    );
  }
  defaultMessage(args: ValidationArguments) {
    return 'Password must not contain letter sequences (abc, xyz)';
  }
}

// Custom validator for no keyboard pattern
@ValidatorConstraint({ name: 'noKeyboardPattern', async: false })
class NoKeyboardPatternConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    const patterns = ['qwerty', 'asdfgh', 'zxcvbn', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    const lowerPwd = password.toLowerCase();
    return !patterns.some((pattern) => lowerPwd.includes(pattern));
  }
  defaultMessage(args: ValidationArguments) {
    return 'Password must not contain keyboard patterns (qwerty, asdf)';
  }
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token',
    example: 'dc4c049a-e482-464f-a29b',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password (must meet all security requirements)',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/, { message: 'Password must contain at least one symbol' })
  @Validate(NoRepetitionConstraint)
  @Validate(NoNumberSequenceConstraint)
  @Validate(NoLetterSequenceConstraint)
  @Validate(NoKeyboardPatternConstraint)
  password: string;
}