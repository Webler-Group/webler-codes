import fs from 'fs';
import path from 'path';
import { generateRandomFileName } from '../../utils/fileUtils';
import { writeLogFile } from '../logger';

jest.mock('fs');
jest.mock('path');
jest.mock('../../utils/fileUtils');

describe('writeLogFile', () => {
    const mockDirPath = '/mocked/log/dir';
    const mockFileName = 'mockedFileName';
    const mockLogFilePath = path.join(mockDirPath, `${mockFileName}.log`);
    const mockContent = 'This is a log content';

    beforeEach(() => {
        jest.clearAllMocks();

        (generateRandomFileName as jest.Mock).mockReturnValue(mockFileName);
        (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
        (fs.existsSync as jest.Mock).mockReturnValue(true);
    });

    it('should create log file in /logs directory', () => {
        // Arrange
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

        // Act
        writeLogFile(mockContent);

        // Assert
        expect(fs.existsSync).toHaveBeenCalledWith(mockDirPath);
        expect(fs.mkdirSync).toHaveBeenCalledWith(mockDirPath);
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            mockLogFilePath,
            `${mockContent}\n`,
            { encoding: 'utf-8' }
        );
    });

    it('should write log file without creating directory if it exists', () => {
        // Arrange
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        // Act
        writeLogFile(mockContent);

        // Assert
        expect(fs.existsSync).toHaveBeenCalledWith(mockDirPath);
        expect(fs.mkdirSync).not.toHaveBeenCalled();
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            mockLogFilePath,
            `${mockContent}\n`,
            { encoding: 'utf-8' }
        );
    });

    it('should log file path in development environment', () => {
        // Arrange
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        console.log = jest.fn();

        // Act
        writeLogFile(mockContent);

        // Assert
        expect(console.log).toHaveBeenCalledWith(`Log file written at ${mockLogFilePath}`);

        // Cleanup
        process.env.NODE_ENV = originalEnv;
    });

    it('should not log file path in non-development environment', () => {
        // Arrange
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        console.log = jest.fn();

        // Act
        writeLogFile(mockContent);

        // Assert
        expect(console.log).not.toHaveBeenCalled();

        // Cleanup
        process.env.NODE_ENV = originalEnv;
    });

    it('should throw an error if writing the log file fails', () => {
        // Arrange
        (fs.writeFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('Failed to write file');
        });

        // Act & Assert
        expect(() => writeLogFile(mockContent)).toThrow('Failed to write file');
    });

    it('should throw an error if creating the directory fails', () => {
        // Arrange
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        (fs.mkdirSync as jest.Mock).mockImplementation(() => {
            throw new Error('Failed to create directory');
        });

        // Act & Assert
        expect(() => writeLogFile(mockContent)).toThrow('Failed to create directory');
    });
});
