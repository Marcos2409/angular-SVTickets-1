import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const emailsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const email = control.get('email')?.value;
  const email2 = control.get('email2')?.value;

  return email && email2 && email === email2
    ? null
    : { valuesMismatch: true }; 
};
