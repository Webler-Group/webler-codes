import { Prisma, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../utils/globals';

const dbClient = new PrismaClient();

const main = async () => {
    const adminData: Prisma.UserCreateInput = {
        email: ADMIN_EMAIL,
        username: 'weblercodes',
        password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
        isVerified: true,
        roles: [Role.USER, Role.CREATOR, Role.MODERATOR, Role.ADMIN],
        level: 25,
        profile: {
            connectOrCreate: {
                where: { userId: 0 },
                create: {
                    workplace: 'Webler Codes'
                }
            }
        }
    };

    const admin = await dbClient.user.upsert({
        where: { email: ADMIN_EMAIL },
        create: adminData,
        update: adminData
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