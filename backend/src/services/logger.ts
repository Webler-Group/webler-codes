import fs from 'fs';
import { format } from 'date-fns';
import path from 'path';
import { NODE_ENV } from '../utils/globals';

const logEvents = (data: any, logFileName: string) => {
    try {
        const dateTime = format(new Date(), 'yyyy/MM/dd HH:mm:ss');
        const logItem = `${dateTime} ${data}\n`;
        const dirPath = path.join(__dirname, '../../logs');

        if(NODE_ENV === 'development') {
            console.log(logItem);
        }

        if(!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        fs.appendFileSync(path.join(dirPath, logFileName), logItem, { encoding: 'utf-8' });

    } catch (error) {
        console.log(error);
    }
}

export {
    logEvents
}