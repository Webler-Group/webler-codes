import { format } from 'date-fns';

export const generateRandomFileName = () => {
    const dateTimeString = format(new Date(), 'yyyy-MM-dd-hh-mm-ss');
    const fileName = dateTimeString + "-" + ("" + Math.random()).substring(2, 8);
    return fileName;
}