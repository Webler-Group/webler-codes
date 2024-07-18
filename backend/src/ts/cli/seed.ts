import { Prisma, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../utils/globals';
import { codeTemplateSeed } from './codeTemplateSeed';

const dbClient = new PrismaClient();

export const main = async (): Promise<void> => {
    const adminData: Prisma.UserCreateInput = {
        email: ADMIN_EMAIL,
        username: 'weblercodes',
        password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
        isVerified: true,
        roles: [Role.USER, Role.CREATOR, Role.MODERATOR, Role.ADMIN],
        level: 25
    };

    const admin = await dbClient.user.upsert({
        where: { email: ADMIN_EMAIL },
        create: adminData,
        update: {}
    });

    const testUser = await dbClient.user.upsert({
        where: { email: 'test@test.com' },
        create: {
            email: 'test@test.com',
            username: 'test',
            password: bcrypt.hashSync('a1b2c3', 10),
            isVerified: true,
            roles: [Role.USER]
        },
        update: {}
    });

    console.log({ admin, testUser });
    
}

main()
    .then(codeTemplateSeed)
    .then(async () => {
        await dbClient.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await dbClient.$disconnect()
        process.exit(1)
    });
