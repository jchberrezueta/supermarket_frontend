import { AbstractControl, ValidationErrors} from "@angular/forms";

/**
**Expresion Regular REGEX Para validar nombres, apellidos y razon social
**/
const patternDatosPersonales = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+( [a-zA-ZñÑáéíóúÁÉÍÓÚ]+)*$/;
// /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+( [a-zA-ZñÑáéíóúÁÉÍÓÚ]+)*$/


export const customDatoPersonalValidator = (control: AbstractControl): ValidationErrors | null => {

    if(!patternDatosPersonales.test(control.value)){
        return {
            customDatoPersonalValidator: true
        }
    }
    return null;
}