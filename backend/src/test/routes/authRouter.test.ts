import request from 'supertest';
import app from '../../ts/server';
import {setupTestDatabase, teardownTestDatabase} from '../setup';
import {prisma} from "../../ts/services/database";
import {bigintToNumber} from "../../ts/utils/utils";

// beforeAll(async () => {
//     await setupTestDatabase();
//     // Verify that the database has been seeded correctly
//     const users = await testPrismaClient.user.findMany();
//     console.log('Users in test database:', users);
//     expect(users.length).toBeGreaterThan(0); // Ensure there are users
// });
//
// afterAll(async () => {
//     await teardownTestDatabase();
// });


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
            expect(res.body).toHaveProperty('success', true);

            // Check if the user was actually created in the test database
            const user = await prisma.user.findUnique({
                where: { email: newUser.email }
            });
            console.log("Registered At", user?.registeredAt);
            console.log("Failed", user?.failedLoginCount);
            console.log("Last", user?.lastTimeLoggedIn);
            expect(user).not.toBeNull();
            expect(user?.username).toBe(newUser.username);
            expect(user?.id).toBe(prevId + 1);
            expect(user?.xp).toBe(0);
            expect(user?.isVerified).toBe(false);
            //TODO registeredAt and LastTimeLoggedIn.
        });

        // it('should throw an error if username is already in use', async () => {
        //     // Seed database with a user
        //     await testPrismaClient.user.create({
        //         data: { username: 'testuser', email: 'other@example.com', password: 'hashedPassword', roles: ['USER'] }
        //     });
        //
        //     const res = await request(app)
        //         .post('/api/auth/register')
        //         .send({ username: 'testuser', email: 'new@example.com', password: 'password' });
        //
        //     expect(res.status).toBe(400);
        //     expect(res.body.message).toBe('Username is already in use');
        // });
        //
        // it('should throw an error if email is already in use', async () => {
        //     // Seed database with a user
        //     await testPrismaClient.user.create({
        //         data: { username: 'otheruser', email: 'test@example.com', password: 'hashedPassword', roles: ['USER'] }
        //     });
        //
        //     const res = await request(app)
        //         .post('/api/auth/register')
        //         .send({ username: 'newuser', email: 'test@example.com', password: 'password' });
        //
        //     expect(res.status).toBe(400);
        //     expect(res.body.message).toBe('Email is already in use');
        // });
    });

    // describe('POST /login', () => {
    //     it('should log in a user', async () => {
    //         // Seed database with a user
    //         await testPrismaClient.user.create({
    //             data: { username: 'testuser', email: 'test@example.com', password: 'hashedPassword', roles: ['USER'], isVerified: true }
    //         });
    //
    //         const res = await request(app)
    //             .post('/api/auth/login')
    //             .send({ email: 'test@example.com', password: 'password' });
    //
    //         expect(res.status).toBe(200);
    //         expect(res.body).toHaveProperty('accessToken');
    //     });
    //
    //     it('should throw an error if password is incorrect', async () => {
    //         // Seed database with a user
    //         await testPrismaClient.user.create({
    //             data: { username: 'testuser', email: 'test@example.com', password: 'hashedPassword', roles: ['USER'] }
    //         });
    //
    //         const res = await request(app)
    //             .post('/api/auth/login')
    //             .send({ email: 'test@example.com', password: 'wrongpassword' });
    //
    //         expect(res.status).toBe(400);
    //         expect(res.body.message).toBe('Password is not correct');
    //     });
    //
    //     it('should throw an error if user is not verified', async () => {
    //         // Seed database with a user
    //         await testPrismaClient.user.create({
    //             data: { username: 'testuser', email: 'test@example.com', password: 'hashedPassword', roles: ['USER'], isVerified: false }
    //         });
    //
    //         const res = await request(app)
    //             .post('/api/auth/login')
    //             .send({ email: 'test@example.com', password: 'password' });
    //
    //         expect(res.status).toBe(403);
    //         expect(res.body.message).toBe('User is not verified');
    //     });
    // });
    //
    // describe('POST /logout', () => {
    //     it('should log out a user', async () => {
    //         const res = await request(app)
    //             .post('/api/auth/logout')
    //             .set('Cookie', ['refreshToken=someToken']);
    //
    //         expect(res.status).toBe(200);
    //     });
    // });

    // describe('POST /resendEmailVerificationCode', () => {
    //     it('should resend email verification code', async () => {
    //         // Seed database with an unverified user
    //         await testPrismaClient.user.create({
    //             data: { username: 'testuser', email: 'test@example.com', isVerified: false }
    //         });
    //
    //         const res = await request(app)
    //             .post('/api/auth/resendEmailVerificationCode')
    //             .send({ email: 'test@example.com' });
    //
    //         expect(res.status).toBe(200);
    //         expect(res.body).toHaveProperty('success', true);
    //     });
    //
    //     it('should throw an error if user is already verified', async () => {
    //         // Seed database with a verified user
    //         await testPrismaClient.user.create({
    //             data: { username: 'testuser', email: 'test@example.com', isVerified: true }
    //         });
    //
    //         const res = await request(app)
    //             .post('/api/auth/resendEmailVerificationCode')
    //             .send({ email: 'test@example.com' });
    //
    //         expect(res.status).toBe(400);
    //         expect(res.body.message).toBe('User is already verified');
    //     });
    // });
    //
    // describe('POST /verifyEmail', () => {
    //     it('should verify user email', async () => {
    //         // Seed database with a user and a verification code
    //         await testPrismaClient.user.create({
    //             data: { username: 'testuser', email: 'test@example.com' }
    //         });
    //         await testPrismaClient.verficationCode.create({
    //             data: { userId: 1, code: '123456', validFrom: new Date(), expiresInMinutes: 10 }
    //         });
    //
    //         const res = await request(app)
    //             .post('/api/auth/verifyEmail')
    //             .send({ email: 'test@example.com', code: '123456' });
    //
    //         expect(res.status).toBe(200);
    //         expect(res.body).toHaveProperty('success', true);
    //     });
    //
    //     it('should throw an error if verification code is not found', async () => {
    //         await testPrismaClient.user.create({
    //             data: { username: 'testuser', email: 'test@example.com' }
    //         });
    //
    //         const res = await request(app)
    //             .post('/api/auth/verifyEmail')
    //             .send({ email: 'test@example.com', code: 'wrongCode' });
    //
    //         expect(res.status).toBe(404);
    //         expect(res.body.message).toBe('Verification code not found');
    //     });
    //
    //     it('should throw an error if verification code is expired', async () => {
    //         await testPrismaClient.user.create({
    //             data: { username: 'testuser', email: 'test@example.com' }
    //         });
    //         await testPrismaClient.verficationCode.create({
    //             data: { userId: 1, code: '123456', validFrom: new Date(Date.now() - 11 * 60 * 1000), expiresInMinutes: 10 }
    //         });
    //
    //         const res = await request(app)
    //             .post('/api/auth/verifyEmail')
    //             .send({ email: 'test@example.com', code: '123456' });
    //
    //         expect(res.status).toBe(400);
    //         expect(res.body.message).toBe('Verification code is expired');
    //     });
    // });
    //
    // describe('GET /me', () => {
    //     it('should get authenticated user', async () => {
    //         // Seed database with a user
    //         await testPrismaClient.user.create({
    //             data: { id: 1, email: 'test@example.com', roles: ['USER'] }
    //         });
    //
    //         // Mock authentication middleware to pass for this test
    //         const res = await request(app)
    //             .get('/api/auth/me')
    //             .set('Authorization', 'Bearer accessToken'); // Use a valid token if needed
    //
    //         expect(res.status).toBe(200);
    //         expect(res.body).toEqual(expect.objectContaining({ email: 'test@example.com' }));
    //     });
    // });

    // describe('POST /refreshToken', () => {
    //     it('should refresh token', async () => {
    //         // Seed database with a user
    //         await testPrismaClient.user.create({
    //             data: { id: 1, email: 'test@example.com', roles: ['USER'] }
    //         });
    //
    //         const res = await request(app)
    //             .post('/api/auth/refreshToken')
    //             .set('Cookie', ['refreshToken=validToken']);
    //
    //         expect(res.status).toBe(200);
    //         expect(res.body).toHaveProperty('accessToken');
    //     });
    //
    //     it('should throw an error if refresh token is invalid', async () => {
    //         const res = await request(app)
    //             .post('/api/auth/refreshToken')
    //             .set('Cookie', ['refreshToken=invalidToken']);
    //
    //         expect(res.status).toBe(401);
    //         expect(res.body.message).toBe('Refresh token is invalid');
    //     });
    //
    //     it('should throw an error if refresh token is not set', async () => {
    //         const res = await request(app)
    //             .post('/api/auth/refreshToken');
    //
    //         expect(res.status).toBe(401);
    //         expect(res.body.message).toBe('Refresh token is not set');
    //     });
    // });
});