import {config} from 'dotenv';
import { promisify } from 'util';
import { exec } from 'child_process';
import {Prisma, PrismaClient, Role} from '@prisma/client';
import * as bcrypt from "bcryptjs";


config({path: '.env.test'});

const testPrismaClient = new PrismaClient();

const execPromise = promisify(exec);

// ensure the database migration and deployment
const runMigrations = async () => await execPromise('npx prisma migrate deploy', { cwd: '../../prisma' });


/**
 * This function seed the test db client with a default admin and one regular test user.
 * It works by first resetting the database
 *      SQL (`TRUNCATE TABLE users CASCADE`)
 * then inserting the users as mentioned, respectively. For some reason if I tried using the
 * default syntax from ts/cli/seed.ts as is below, All major test will fail, except
 * the email and password are explicitly stated
 *
 *   ********* Beginning of fail sample instance ***************************
 *   *****************************************************************
 * `const adminData: Prisma.UserCreateInput = {
 *         email: ADMIN_EMAIL,
 *         username: 'weblercodes',
 *         password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
 *         isVerified: true,
 *         roles: [Role.USER, Role.CREATOR, Role.MODERATOR, Role.ADMIN],
 *         level: 25
 *  };`
 *
 *     `const admin = await dbClient.user.upsert({
 *         where: { email: ADMIN_EMAIL },
 *         create: adminData,
 *         update: {}
 *     });  `
 *     *****************************************************************
 *     ********* End of fail sample instance ***************************
 */
const seedTestDatabase = async (): Promise<void> => {
    await testPrismaClient.$executeRaw`TRUNCATE TABLE users CASCADE;`;

    // using ADMIN_EMAIL from global is a disaster, i won't try it again
    const ADMIN_EMAIL = "admin@bangbros.com";

    const adminData: Prisma.UserCreateInput = {
        email: ADMIN_EMAIL,
        username: 'testAdmin',
        password: bcrypt.hashSync("testing321", 10),
        isVerified: true,
        roles: [Role.USER, Role.CREATOR, Role.MODERATOR, Role.ADMIN],
        level: 25
    };

    await testPrismaClient.user.upsert({
        where: { email: ADMIN_EMAIL },
        create: adminData,
        update: {}
    });

    await testPrismaClient.user.upsert({
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
};


const setupTestDatabase = async () => {
    try {
        await testPrismaClient.$connect();
        await runMigrations();
        await seedTestDatabase();
        console.log("Database setup successful");
    } catch (error) {
        console.error('Error setting up the test database:', error);
        process.exit(1);
    }
};

const teardownTestDatabase = () => testPrismaClient.$disconnect();


export {
    testPrismaClient,
    setupTestDatabase,
    teardownTestDatabase
};