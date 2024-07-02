import ForbiddenException from "../exceptions/ForbiddenException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { dbClient } from "./database";
import { sendMail } from "./email";

/**
 * Creates 6-digit verification code in DB and sends email
 * 
 * @param userId User ID
 * @param username Username
 * @param userEmail Email
 */
const generateEmailVerificationCode = async (userId: number, username: string, userEmail: string) => {
    const code = ("" + Math.random()).substring(2, 8);

    const codeRecord = await dbClient.verficationCode.create({
        data: {
            userId,
            code
        }
    });

    const emailHtml = `<p>Hello <b>${username}</b>,<br>
    <br>
    Verify your email address with the code bellow:</p>
    <h4>${code}</h4>
    <p>This code expires in ${codeRecord.expiresInMinutes} minutes.</p>
    <p>With regards,<br>
    <br>
    Your Webler Codes team</p>`;

    await sendMail(userEmail, 'Account Verification', emailHtml);
}

/**
 * Throws exception if user doesn't exist or isn't verified
 * 
 * @param userId User ID
 * @returns User
 */
const validateUser = async (userId: number) => {
    const user = await dbClient.user.findFirst({ where: { id: userId } });
        
    if(!user || !user.isVerified) {
        throw new ForbiddenException('Forbidden', ErrorCode.FORBIDDEN);
    }

    return user;
}

export {
    generateEmailVerificationCode,
    validateUser
}