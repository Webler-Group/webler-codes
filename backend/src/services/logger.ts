import fs from 'fs';
import path from 'path';
import { LOG_DIR, NODE_ENV } from '../utils/globals';
import { generateRandomFileName } from '../utils/fileUtils';

/**
 * Creates log file in /logs directory
 * 
 * @param content Log file content
 */
const writeLogFile = (content: any): void => {
    let logFileName = `${generateRandomFileName()}.log`;
    let dirPath = path.join(__dirname, '../..', LOG_DIR);

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