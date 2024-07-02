import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USER } from '../utils/globals';
import { writeLogFile } from './logger';

const mailTransport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
});

const sendMail = async (to: string[] | string, subject: string, html: string) => {
    const mailOptions = {
        from: `Webler Codes Team <${EMAIL_USER}>`,
        to,
        subject,
        html
    };
    
    try {
        await mailTransport.sendMail(mailOptions);
    } catch(error: any) {
        writeLogFile(error.stack);
    }
}

export {
    sendMail
}