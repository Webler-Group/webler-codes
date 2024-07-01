import ForbiddenException from "../exceptions/ForbiddenException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { randint } from "../utils/mathUtils";
import { dbClient } from "./database";
import { sendMail } from "./email";

const generateEmailVerificationCode = async (userId: number, username: string, userEmail: string) => {
    let code = '';
    for(let i = 0; i < 6; ++i) {
        code += randint(0, 9);
    }

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
    Your Weblercodes team</p>`;

    await sendMail(userEmail, 'Account verification', emailHtml);
}

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