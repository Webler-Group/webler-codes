// import request from 'supertest';
// import { app } from '../../src/server';
// import { prisma } from '../../src/services/database';
// import * as bcrypt from 'bcryptjs';
// import * as jwt from 'jsonwebtoken';
// import { REFRESH_TOKEN_SECRET } from '../../src/utils/globals';
// import { Role } from '@prisma/client';
// import { generateEmailVerificationCode } from '../../src/helpers/authHelper';
// import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../../src/utils/tokenUtils';
//
// // Mock dependencies
// jest.mock('../../src/services/database');
// jest.mock('bcryptjs');
// jest.mock('jsonwebtoken');
// jest.mock('../../src/helpers/authHelper');
// jest.mock('../../src/utils/tokenUtils');
//
// describe('Auth Controller', () => {
//     let server: any;
//
//     beforeAll(() => {
//         server = app.listen(4000);
//     });
//
//     afterAll(() => {
//         server.close();
//     });
//
//     describe('register', () => {
//         it('should register a new user', async () => {
//             const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password: 'hashedPassword', roles: [Role.USER] };
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null);
//             (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockUser);
//             (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');
//             (generateEmailVerificationCode as jest.Mock).mockResolvedValueOnce(null);
//
//             const res = await request(app)
//                 .post('/api/auth/register')
//                 .send({ username: 'testuser', email: 'test@example.com', password: 'password' });
//
//             expect(res.status).toBe(200);
//             expect(res.body).toHaveProperty('success', true);
//             expect(res.body.userInfo).toEqual(expect.objectContaining({ username: 'testuser', email: 'test@example.com' }));
//         });
//
//         it('should throw an error if username is already in use', async () => {
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce({});
//
//             const res = await request(app)
//                 .post('/api/auth/register')
//                 .send({ username: 'testuser', email: 'test@example.com', password: 'password' });
//
//             expect(res.status).toBe(400);
//             expect(res.body.message).toBe('Username is already in use');
//         });
//
//         it('should throw an error if email is already in use', async () => {
//             (prisma.user.findFirst as jest.Mock)
//                 .mockResolvedValueOnce(null)
//                 .mockResolvedValueOnce({});
//
//             const res = await request(app)
//                 .post('/api/auth/register')
//                 .send({ username: 'testuser', email: 'test@example.com', password: 'password' });
//
//             expect(res.status).toBe(400);
//             expect(res.body.message).toBe('Email is already in use');
//         });
//     });
//
//     describe('login', () => {
//         it('should log in a user', async () => {
//             const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword', isVerified: true };
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
//             (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
//             (jwt.sign as jest.Mock).mockReturnValue('accessToken');
//             (setRefreshTokenCookie as jest.Mock).mockReturnValue(null);
//
//             const res = await request(app)
//                 .post('/api/auth/login')
//                 .send({ email: 'test@example.com', password: 'password' });
//
//             expect(res.status).toBe(200);
//             expect(res.body).toHaveProperty('accessToken');
//         });
//
//         it('should throw an error if password is incorrect', async () => {
//             const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
//             (bcrypt.compareSync as jest.Mock).mockReturnValue(false);
//
//             const res = await request(app)
//                 .post('/api/auth/login')
//                 .send({ email: 'test@example.com', password: 'wrongpassword' });
//
//             expect(res.status).toBe(400);
//             expect(res.body.message).toBe('Password is not correct');
//         });
//
//         it('should throw an error if user is not verified', async () => {
//             const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword', isVerified: false };
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
//             (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
//
//             const res = await request(app)
//                 .post('/api/auth/login')
//                 .send({ email: 'test@example.com', password: 'password' });
//
//             expect(res.status).toBe(403);
//             expect(res.body.message).toBe('User is not verified');
//         });
//     });
//
//     describe('logout', () => {
//         it('should log out a user', async () => {
//             (clearRefreshTokenCookie as jest.Mock).mockReturnValue(null);
//
//             const res = await request(app)
//                 .post('/api/auth/logout')
//                 .set('Cookie', ['refreshToken=someToken']);
//
//             expect(res.status).toBe(200);
//         });
//     });
//
//     describe('resendEmailVerificationCode', () => {
//         it('should resend email verification code', async () => {
//             const mockUser = { id: 1, email: 'test@example.com', isVerified: false };
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
//             (generateEmailVerificationCode as jest.Mock).mockResolvedValueOnce(null);
//
//             const res = await request(app)
//                 .post('/api/auth/resend-email-verification-code')
//                 .send({ email: 'test@example.com' });
//
//             expect(res.status).toBe(200);
//             expect(res.body).toHaveProperty('success', true);
//         });
//
//         it('should throw an error if user is already verified', async () => {
//             const mockUser = { id: 1, email: 'test@example.com', isVerified: true };
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
//
//             const res = await request(app)
//                 .post('/api/auth/resend-email-verification-code')
//                 .send({ email: 'test@example.com' });
//
//             expect(res.status).toBe(400);
//             expect(res.body.message).toBe('User is already verified');
//         });
//     });
//
//     describe('verifyEmail', () => {
//         it('should verify user email', async () => {
//             const mockUser = { id: 1, email: 'test@example.com' };
//             const mockVerificationCode = { userId: 1, code: '123456', validFrom: new Date(), expiresInMinutes: 10 };
//
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
//             (prisma.verficationCode.findFirst as jest.Mock).mockResolvedValueOnce(mockVerificationCode);
//             (prisma.user.update as jest.Mock).mockResolvedValueOnce(null);
//             (prisma.verficationCode.delete as jest.Mock).mockResolvedValueOnce(null);
//
//             const res = await request(app)
//                 .post('/api/auth/verify-email')
//                 .send({ email: 'test@example.com', code: '123456' });
//
//             expect(res.status).toBe(200);
//             expect(res.body).toHaveProperty('success', true);
//         });
//
//         it('should throw an error if verification code is not found', async () => {
//             const mockUser = { id: 1, email: 'test@example.com' };
//
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
//             (prisma.verficationCode.findFirst as jest.Mock).mockResolvedValueOnce(null);
//
//             const res = await request(app)
//                 .post('/api/auth/verify-email')
//                 .send({ email: 'test@example.com', code: 'wrongCode' });
//
//             expect(res.status).toBe(404);
//             expect(res.body.message).toBe('Verification code not found');
//         });
//
//         it('should throw an error if verification code is expired', async () => {
//             const mockUser = { id: 1, email: 'test@example.com' };
//             const mockVerificationCode = { userId: 1, code: '123456', validFrom: new Date(Date.now() - 11 * 60 * 1000), expiresInMinutes: 10 };
//
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
//             (prisma.verficationCode.findFirst as jest.Mock).mockResolvedValueOnce(mockVerificationCode);
//
//             const res = await request(app)
//                 .post('/api/auth/verify-email')
//                 .send({ email: 'test@example.com', code: '123456' });
//
//             expect(res.status).toBe(400);
//             expect(res.body.message).toBe('Verification code is expired');
//         });
//     });
//
//     describe('getMe', () => {
//         it('should get authenticated user', async () => {
//             const mockUser = { id: 1, email: 'test@example.com', roles: [Role.USER] };
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
//
//             const res = await request(app)
//                 .get('/api/auth/me')
//                 .set('Authorization', 'Bearer accessToken');
//
//             expect(res.status).toBe(200);
//             expect(res.body).toEqual(expect.objectContaining({ email: 'test@example.com' }));
//         });
//     });
//
//     describe('refreshToken', () => {
//         it('should refresh token', async () => {
//             const mockUser = { id: 1, email: 'test@example.com', roles: [Role.USER] };
//             const mockDecoded = { userId: 1 };
//
//             (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => callback(null, mockDecoded));
//             (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
//             (jwt.sign as jest.Mock).mockReturnValue('newAccessToken');
//             (setRefreshTokenCookie as jest.Mock).mockReturnValue(null);
//
//             const res = await request(app)
//                 .post('/api/auth/refresh-token')
//                 .set('Cookie', ['refreshToken=someToken']);
//
//             expect(res.status).toBe(200);
//             expect(res.body).toHaveProperty('accessToken', 'newAccessToken');
//         });
//
//         it('should throw an error if refresh token is invalid', async () => {
//             (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => callback(new Error('Invalid token'), null));
//
//             const res = await request(app)
//                 .post('/api/auth/refresh-token')
//                 .set('Cookie', ['refreshToken=invalidToken']);
//
//             expect(res.status).toBe(401);
//             expect(res.body.message).toBe('Refresh token is invalid');
//         });
//
//         it('should throw an error if refresh token is not set', async () => {
//             const res = await request(app)
//                 .post('/api/auth/refresh-token');
//
//             expect(res.status).toBe(401);
//             expect(res.body.message).toBe('Refresh token is not set');
//         });
//     });
// });
//
//
//
// import request from 'supertest';
// import { app } from '../../src/server';
// import { prisma } from '../../src/services/database';
// import * as bcrypt from 'bcryptjs';
// import * as jwt from 'jsonwebtoken';
// import { REFRESH_TOKEN_SECRET } from '../../src/utils/globals';
// import { Role } from '@prisma/client';
// import { generateEmailVerificationCode } from '../../src/helpers/authHelper';
// import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../../src/utils/tokenUtils';
//
// // Mock dependencies
// jest.mock('../../src/services/database');
// jest.mock('bcryptjs');
// jest.mock('jsonwebtoken');
// jest.mock('../../src/helpers/authHelper');
// jest.mock('../../src/utils/tokenUtils');
//
// describe('Auth Controller', () => {
//     let server: any;
//
//     beforeAll(() => {
//         server = app.listen(4000);
//     });
//
//     beforeEach(async () => {
//         await prisma.$executeRaw`TRUNCATE TABLE users CASCADE;`; // Reset the database before each test
//
//     });
//
//     afterAll(async () => {
//         await prisma.$disconnect();
//         server.close();
//     });
//
//
// });
