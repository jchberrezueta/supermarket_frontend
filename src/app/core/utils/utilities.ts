
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

export const isValidStringValue = (value: string): boolean => {
    return (value !== null && value !== undefined && value.trim() !== '');
}