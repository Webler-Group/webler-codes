import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../utils/globals';

const dbClient = new PrismaClient();

const main = async () => {
    const admin = await dbClient.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: {},
        create: {
            email: ADMIN_EMAIL,
            username: 'weblercodes',
            password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
            isVerified: true,
            roles: [Role.USER, Role.CREATOR, Role.MODERATOR, Role.ADMIN],
            workplace: "Webler Codes"
        },
    });

    console.log({ admin });
}

main()
    .then(async () => {
        await dbClient.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await dbClient.$disconnect()
        process.exit(1)
    });