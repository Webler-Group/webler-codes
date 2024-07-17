import request from 'supertest';
import express from 'express';
import authRouter from '../authRouter'
import {
    getMe,
    login,
    logout,
    refreshToken,
    register,
    resendEmailVerificationCode,
    verifyEmail
} from '../../controllers/authController';
import { authMiddleware } from '../../middleware/authMiddleware';
import { Role } from '@prisma/client';

jest.mock('../../controllers/authController');
jest.mock('../../middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('authRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/register', () => {
        it('should call register controller', async () => {
            (register as jest.Mock).mockImplementation((req, res) => res.status(200).send());

            const response = await request(app).post('/auth/register').send({});

            expect(register).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });
    });

    describe('POST /auth/login', () => {
        it('should call login controller', async () => {
            (login as jest.Mock).mockImplementation((req, res) => res.status(200).send());

            const response = await request(app).post('/auth/login').send({});

            expect(login).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });
    });

    describe('POST /auth/resendEmailVerificationCode', () => {
        it('should call resendEmailVerificationCode controller', async () => {
            (resendEmailVerificationCode as jest.Mock).mockImplementation((req, res) => res.status(200).send());

            const response = await request(app).post('/auth/resendEmailVerificationCode').send({});

            expect(resendEmailVerificationCode).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });
    });

    describe('POST /auth/verifyEmail', () => {
        it('should call verifyEmail controller', async () => {
            (verifyEmail as jest.Mock).mockImplementation((req, res) => res.status(200).send());

            const response = await request(app).post('/auth/verifyEmail').send({});

            expect(verifyEmail).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });
    });

    describe('POST /auth/logout', () => {
        it('should call logout controller', async () => {
            (logout as jest.Mock).mockImplementation((req, res) => res.status(200).send());

            const response = await request(app).post('/auth/logout').send({});

            expect(logout).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });
    });

    describe('POST /auth/refreshToken', () => {
        it('should call refreshToken controller', async () => {
            (refreshToken as jest.Mock).mockImplementation((req, res) => res.status(200).send());

            const response = await request(app).post('/auth/refreshToken').send({});

            expect(refreshToken).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });
    });

    describe('GET /auth/me', () => {
        it('should call authMiddleware and getMe controller', async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (getMe as jest.Mock).mockImplementation((req, res) => res.status(200).send());

            const response = await request(app).get('/auth/me').send({});

            expect(authMiddleware).toHaveBeenCalledWith(expect.anything(), Role.USER, expect.anything(), expect.anything());
            expect(getMe).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });
    });
});
