import fs from 'fs';
import path from 'path';
import { NODE_ENV } from '../utils/globals';
import { generateRandomFileName } from '../utils/fileUtils';

const writeLogFile = (content: any) => {
    let logFileName = `${generateRandomFileName()}.log`;
    let dirPath = path.join(__dirname, '../../logs');

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }

    let logFilePath = path.join(dirPath, logFileName);

    fs.writeFileSync(logFilePath, content + '\n', { encoding: 'utf-8' });

    if (NODE_ENV === 'development') {
        console.log(`Log file written at ${logFilePath}`);
    }
}

export {
    writeLogFile
}