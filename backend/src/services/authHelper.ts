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
export const generateEmailVerificationCode = async (userId: number, username: string, userEmail: string) => {
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
 * Returns user by ID if exists and is verified else throws exception
 * 
 * @param userId User ID
 * @returns User
 */
export const getAuthenticatedUser = async (userId: number) => {
    const user = await dbClient.user.findFirst({ where: { id: userId } });
        
    if(!user || !user.isVerified) {
        throw new ForbiddenException('User is not authenticated', ErrorCode.FORBIDDEN);
    }

    return user;
}