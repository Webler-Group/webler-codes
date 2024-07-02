import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER } from '../utils/globals';

const mailTransport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    },
    debug: false,
    logger: true
});

/**
 * Sends email to given recipients from system address
 * 
 * @param to Array of email recipients
 * @param subject Email subject
 * @param html Email content in HTML format
 */
const sendMail = async (to: string[] | string, subject: string, html: string) => {
    const mailOptions = {
        from: `Webler Codes Team <${EMAIL_USER}>`,
        to,
        subject,
        html
    };
    
    await mailTransport.sendMail(mailOptions);
}

export {
    sendMail
}