import nodemailer from 'nodemailer';
import { EMAIL_USER } from '../../utils/globals';
import { sendMail } from '../email';

jest.mock('nodemailer');

const sendMailMock = jest.fn();
(nodemailer.createTransport as jest.Mock).mockReturnValue({
    sendMail: sendMailMock,
});

describe('sendMail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send an email with the correct options', async () => {
        // Arrange
        const to = 'recipient@example.com';
        const subject = 'Test Subject';
        const html = '<h1>Test Email</h1>';

        sendMailMock.mockResolvedValue({});

        // Act
        await sendMail(to, subject, html);

        // Assert
        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.EMAIL_SECURE),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            debug: false,
            logger: true
        });

        expect(sendMailMock).toHaveBeenCalledWith({
            from: `Webler Codes Team <${EMAIL_USER}>`,
            to,
            subject,
            html
        });
    });

    it('should send an email to multiple recipients', async () => {
        // Arrange
        const to = ['recipient1@example.com', 'recipient2@example.com'];
        const subject = 'Test Subject';
        const html = '<h1>Test Email</h1>';

        sendMailMock.mockResolvedValue({});

        // Act
        await sendMail(to, subject, html);

        // Assert
        expect(sendMailMock).toHaveBeenCalledWith({
            from: `Webler Codes Team <${EMAIL_USER}>`,
            to,
            subject,
            html
        });
    });

    it('should handle errors when sending email fails', async () => {
        // Arrange
        const to = 'recipient@example.com';
        const subject = 'Test Subject';
        const html = '<h1>Test Email</h1>';

        sendMailMock.mockRejectedValue(new Error('Failed to send email'));

        // Act & Assert
        await expect(sendMail(to, subject, html)).rejects.toThrow('Failed to send email');
    });

    it('should throw an error if "to" is not a string or array of strings', async () => {
        // Arrange
        const to = 12345 as unknown as string; // incorrect type
        const subject = 'Test Subject';
        const html = '<h1>Test Email</h1>';

        // Act & Assert
        await expect(sendMail(to, subject, html)).rejects.toThrow('Invalid recipient(s)');
    });

    it('should throw an error if "subject" is not a string', async () => {
        // Arrange
        const to = 'recipient@example.com';
        const subject = 12345 as unknown as string; // incorrect type
        const html = '<h1>Test Email</h1>';

        // Act & Assert
        await expect(sendMail(to, subject, html)).rejects.toThrow('Invalid subject');
    });

    it('should throw an error if "html" is not a string', async () => {
        // Arrange
        const to = 'recipient@example.com';
        const subject = 'Test Subject';
        const html = 12345 as unknown as string; // incorrect type

        // Act & Assert
        await expect(sendMail(to, subject, html)).rejects.toThrow('Invalid email content');
    });
});
