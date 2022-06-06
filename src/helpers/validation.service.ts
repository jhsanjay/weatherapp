import { Injectable } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { requiredField } from './custom-validator';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }
  public addRequiredValidation(): ValidatorFn {
    return Validators.compose([requiredField()]);
  }

}
