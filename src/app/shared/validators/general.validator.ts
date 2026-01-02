
/**
**Expresion regular REGEX Para validar espacios en el texto
**/
const patternSpacesText = /\s/;



export const customSpacesValidator = (value:string): boolean => {
    let resul = false;

    if(patternSpacesText.test(value)){
        resul = true;
    }
    return resul;
}