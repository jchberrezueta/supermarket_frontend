
export const quitarVaciosObjeto = (obj: any) => {
    
    const newObj = Object.entries(obj).reduce<any>((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {});
    console.log(newObj);
}

/*export const quitarVaciosArray = (arr: any[]) => {
   return arr.filter(item => (item !== null && item !== undefined && item !== ''));
}*/