import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cepValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    
    const cepPattern = /^[0-9]{5}-?[0-9]{3}$/;
    const isValid = cepPattern.test(control.value);

    return isValid ? null : { invalidCep: true };
  };
}
