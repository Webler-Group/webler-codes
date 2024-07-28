import {Prisma, Role} from '@prisma/client';
import * as bcrypt from "bcryptjs";
import {prisma} from "../src/services/database";

// environment variable setup, this is to eradicate the use of .env.test file
// literally anything here can be changed well except the DATABASE_URL ofcourse
process.env.NODE_ENV = "test";
process.env.SERVER_NAME = "localhost";
process.env.BACKEND_PORT = "1234";      // any valid port
process.env.DATABASE_URL = "postgresql://webler_user:secret@localhost:5433/webler_codes_localhost_test_db";

process.env.EMAIL_USER = "testUserAdmin@test.com";
process.env.EMAIL_PASSWORD = "xxxx xxxn xxxx xxxx"
process.env.EMAIL_SECURE = "false";
process.env.EMAIL_PORT = "587";
process.env.EMAIL_HOST = "smtp.gmail.com";

process.env.ACCESS_TOKEN_SECRET = "testAccessTokenSecret";
process.env.REFRESH_TOKEN_SECRET = "testRefreshTokenSecret";

process.env.LOG_DIR = "logs";
process.env.ADMIN_EMAIL = "testAdmin@test.com";
process.env.ADMIN_PASSWORD = "testAdminPassword";

/**
 * This function is best called inside a beforeAll() to seed the
 * test db with a default admin and one regular test user.
 * It works by first resetting the database
 *      SQL (`TRUNCATE TABLE users CASCADE`)
 * then inserting the users as mentioned, respectively.
 */
// TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;
const seedTestDatabase = async (): Promise<void> => {
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;

    const ADMIN_EMAIL = "admin@bangbros.com";

    const adminData: Prisma.UserCreateInput = {
        email: ADMIN_EMAIL,
        username: 'testAdmin',
        password: bcrypt.hashSync("testing321Tt.", 10),
        isVerified: true,
        roles: [Role.USER, Role.CREATOR, Role.MODERATOR, Role.ADMIN],
        level: 25
    };

    await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        create: adminData,
        update: {}
    });
};


const setupTestDatabase = async () => {
    try {
        await prisma.$connect();
        await seedTestDatabase();
        console.log("Database setup successful");
    } catch (error) {
        console.error('Error setting up the test database:', error);
        process.exit(1);
    }
};

const teardownTestDatabase = () => prisma.$disconnect();

export {
    setupTestDatabase,
    teardownTestDatabase
};