import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export function matchEmail(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const formGroup = group as FormGroup;
    const email = formGroup.get('email')?.value;
    const email2 = formGroup.get('email2')?.value;

    return email === email2 ? null : { match: true };
  };
}
