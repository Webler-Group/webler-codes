import request from 'supertest';
import express from 'express';
import userRouter from '../userRouter'; // replace with your actual module path
import { follow } from '../../controllers/userController';
import { authMiddleware } from '../../middleware/authMiddleware';
import { Role } from '@prisma/client';

jest.mock('../controllers/userController');
jest.mock('../middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use('/user', userRouter);

describe('userRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /user/follow', () => {
        it('should call authMiddleware and follow controller', async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (follow as jest.Mock).mockImplementation((req, res) => res.status(200).send());

            const response = await request(app).post('/user/follow').send({});

            expect(authMiddleware).toHaveBeenCalledWith(expect.anything(), Role.USER, expect.anything(), expect.anything());
            expect(follow).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });

        it('should return 401 if authMiddleware fails', async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res) => res.status(401).send());

            const response = await request(app).post('/user/follow').send({});

            expect(authMiddleware).toHaveBeenCalled();
            expect(follow).not.toHaveBeenCalled();
            expect(response.status).toBe(401);
        });

        it('should return 500 if follow controller fails', async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (follow as jest.Mock).mockImplementation((req, res) => res.status(500).send());

            const response = await request(app).post('/user/follow').send({});

            expect(authMiddleware).toHaveBeenCalled();
            expect(follow).toHaveBeenCalled();
            expect(response.status).toBe(500);
        });

        it('should return 401 if Authorization header is missing', async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res) => res.status(401).send());

            const response = await request(app).post('/user/follow').set('Authorization', '').send({});

            expect(authMiddleware).toHaveBeenCalled();
            expect(follow).not.toHaveBeenCalled();
            expect(response.status).toBe(401);
        });

        it('should return 400 for invalid JSON payload', async () => {
            const invalidJson = '{"userId": "d3b07384-d9a3-4e7a-9f0f-5e7b2e43c3c5", "isFollow": }';
            const response = await request(app)
                .post('/user/follow')
                .set('Content-Type', 'application/json')
                .send(invalidJson);

            expect(response.status).toBe(400);
        });

        it('should handle valid payload correctly', async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (follow as jest.Mock).mockImplementation((req, res) => res.status(200).send());

            const validPayload = {
                userId: 'd3b07384-d9a3-4e7a-9f0f-5e7b2e43c3c5',
                isFollow: true
            };

            const response = await request(app)
                .post('/user/follow')
                .set('Authorization', 'Bearer valid-token')
                .send(validPayload);

            expect(authMiddleware).toHaveBeenCalled();
            expect(follow).toHaveBeenCalledWith(expect.anything(), expect.anything());
            expect(response.status).toBe(200);
        });

        it('should return 403 if authMiddleware fails due to invalid role', async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res) => res.status(403).send());

            const response = await request(app)
                .post('/user/follow')
                .set('Authorization', 'Bearer invalid-role-token')
                .send({});

            expect(authMiddleware).toHaveBeenCalled();
            expect(follow).not.toHaveBeenCalled();
            expect(response.status).toBe(403);
        });

        it('should return 200 for successful follow action', async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (follow as jest.Mock).mockImplementation((req, res) => res.status(200).json({ message: 'Followed successfully' }));

            const validPayload = {
                userId: 'd3b07384-d9a3-4e7a-9f0f-5e7b2e43c3c5',
                isFollow: true
            };

            const response = await request(app)
                .post('/user/follow')
                .set('Authorization', 'Bearer valid-token')
                .send(validPayload);

            expect(authMiddleware).toHaveBeenCalled();
            expect(follow).toHaveBeenCalledWith(expect.anything(), expect.anything());
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Followed successfully' });
        });
    });
});
