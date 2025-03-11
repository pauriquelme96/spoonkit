import { Field, FieldValidator } from 'src/app/core/domain/field';

export function isEmail(error?: string): FieldValidator {
  return (field: Field<string>) => {
    if (
      !field.get() ||
      !field.get().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return error || 'Must be a valid email';
    }

    return null;
  };
}
export function isRequired(error?: string): FieldValidator {
  return (field: Field<string>) => {
    if (field.get() === null || field.get() === undefined) {
      return error || 'This field is required';
    }

    return null;
  };
}

export function isSecurePassword(error?: string): FieldValidator {
  return (field: Field<string>) => {
    if (!field.get() || field.get().length < 8) {
      return error || 'Must be at least 8 chars long';
    }

    return null;
  };
}
