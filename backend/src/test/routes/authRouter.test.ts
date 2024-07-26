import request from 'supertest';
import * as bcrypt from "bcryptjs";
import app from '../../ts/server';
import {setupTestDatabase, teardownTestDatabase} from '../setup';
import {prisma} from "../../ts/services/database";
import {bigintToNumber} from "../../ts/utils/utils";
import {Role} from "@prisma/client";


describe('Auth Router', () => {

    let prevId: number = 0;

    beforeAll(async () => {
        await setupTestDatabase();
        const users = await prisma.user.findMany();
        console.log('Users in test database:', users);
        users?.forEach(user => {
            prevId = Math.max(bigintToNumber(user.id), prevId);
        });
        expect(true).toBe(true);
    });

    afterAll(async () => {
        await teardownTestDatabase();
    });

    describe('POST /login', () => {
        it('should log in a user with a email', async () => {
            const verifiedUser = await prisma.user.upsert({
                where: { email: 'verified@test.com' },
                create: {
                    email: 'verified@test.com',
                    username: 'verifiedLogger',
                    password: bcrypt.hashSync('a1b2c3', 10),
                    isVerified: true,
                    roles: [Role.USER]
                },
                update: {}
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: verifiedUser.email, password: "a1b2c3" });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
        });

        it('should log in a user with a username', async () => {
            const verifiedUser = await prisma.user.upsert({
                where: { email: 'verified@test.com' },
                create: {
                    email: 'verified@test.com',
                    username: 'verifiedLogger',
                    password: bcrypt.hashSync('a1b2c3', 10),
                    isVerified: true,
                    roles: [Role.USER]
                },
                update: {}
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: verifiedUser.username, password: "a1b2c3" });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
        });

        it('should throw an error if password is incorrect', async () => {
            // Seed database with a user
            await prisma.user.create({
                data: { username: 'testuser', email: 'test@example.com', password: 'hashedPassword', roles: ['USER'] }
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Password is incorrect');
        });

        it('should throw an error if user is not verified', async () => {
            // Seed database with a user
            await prisma.user.create({
                data: { username: 'testuser', email: 'test@example.com', password: 'hashedPassword', roles: ['USER'], isVerified: false }
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password' });

            expect(res.status).toBe(403);
            expect(res.body.message).toBe('User is not verified');
        });
    });


    describe('POST /register', () => {
        it('should register a new user', async () => {
            const newUser = {
                username: "newUser",
                email: "newUser@test.com",
                password: "testing321",
            };

            const res = await request(app)
                .post('/api/auth/register')
                .send(newUser);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body.message).toBe("A verification message has been sent to your email");

            // Check if the user was actually created in the test database
            const user = await prisma.user.findUnique({
                where: { email: newUser.email }
            });

            // user should be created only after they have been verified
            expect(user).toBeNull();
            expect(user?.email).toBe(newUser.email);
            expect(user?.level).toBe(0);
            expect(user?.xp).toBe(0);
            expect(user?.isVerified).toBe(false);
        });

        it('should throw an error if username is already in use', async () => {
            await prisma.user.create({
                data: { username: 'testuser', email: 'other@example.com', password: 'hashedPassword', roles: ['USER'] }
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser', email: 'new@example.com', password: 'password' });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Username is currently not available');
        });

        it('should throw an error if email is already in use', async () => {
            // Seed database with a user
            await prisma.user.create({
                data: { username: 'otheruser', email: 'test@example.com', password: 'hashedPassword', roles: ['USER'] }
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'newuser', email: 'test@example.com', password: 'password' });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('This email has been linked with another account');
        });
    });

});