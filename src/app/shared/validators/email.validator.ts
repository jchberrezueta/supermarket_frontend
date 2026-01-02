import { AbstractControl, ValidationErrors} from "@angular/forms";
import {customSpacesValidator} from "./general.validator";

/**
**Expresion regular REGEX Para validar emails
**/
const patternEmail = /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:\.[a-z]{2,})*$/;
// /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
// /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?/
// ^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:\.[a-z]{2,})*$ (usada)

export const customEmailValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if(customSpacesValidator(value)){
        return {
            customSpaceValidator: true
        }
    }

    if(!patternEmail.test(value)){
        return {
            customEmailValidator: true
        }
    }
    return null;
}