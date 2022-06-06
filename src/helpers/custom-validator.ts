import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Constants } from "./constants";

let constants: Constants = new Constants();

export function requiredField(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let v: any = control.value;
        if (v==null || v ==undefined || v.length <= 0 ) {
            return { 'required': constants.errorEmpty }
        }
        return null;
    }
}
