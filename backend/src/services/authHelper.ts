import { randint } from "../utils/mathUtils";
import { dbClient } from "./database";
import { sendMail } from "./email";

const generateEmailVerificationCode = async (userId: number, username: string, userEmail: string) => {
    let code = '';
    for(let i = 0; i < 6; ++i) {
        code += randint(0, 9);
    }
    console.log('Code: ' + code);

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
    <p><small>This code expires in ${codeRecord.expiresInMinutes} minutes.</small></p>
    <p>With regards,<br>
    <br>
    your Weblercodes team</p>`;

    await sendMail(userEmail, 'Account verification', emailHtml);
}

export {
    generateEmailVerificationCode
}