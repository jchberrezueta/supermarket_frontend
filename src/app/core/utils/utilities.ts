import { FormGroup, FormControl } from '@angular/forms';

// Quitar atributos con valores nulos, undefined o string vacios
export const quitarVaciosObjeto = (obj: object): object => {
    
    const newObj = Object.entries(obj).reduce<any>(
        (acc, [key, value]) => {
            if ((value != null) && (value.trim() !== '')) {
                acc[key] = value;
            }
            return acc;
        }, 
    {});
    return newObj;
}

// Validar valores string
export const isValidStringValue = (value: any): boolean => {
    return (value !== null && value !== undefined && typeof value === 'string' && value.trim() !== '');
}


// Tipo utilitario para convertir una interfaz en un FormGroup tipado
export type FormGroupOf<T> = FormGroup<{
  [K in keyof T]: FormControl<T[K] | null>;
}>;