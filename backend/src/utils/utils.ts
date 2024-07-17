import { format } from 'date-fns';

export const generateRandomFileName = () => {
    const dateTimeString = format(new Date(), 'yyyy-MM-dd-hh-mm-ss');
    
    const fileName = dateTimeString + "-" + ("" + Math.random()).substring(2, 8);
    
    return fileName;
}

export const bigintToNumber = (value: any): any => {
    if(value === null || value instanceof Date) {
        return value;
    }

    if(typeof value !== 'object') {
        return typeof value === 'bigint' ? Number(value) : value;
    }

    if(value instanceof Array) {
        const arr = [];
        for(let v of value) {
            arr.push(bigintToNumber(v));
        }
        return arr;
    }
    
    if(value instanceof Object) {
        const obj: any = {};
        for(let [k, v] of Object.entries(value)) {
            obj[k] = bigintToNumber(v);
        }
        return obj;
    }

    return value;
}