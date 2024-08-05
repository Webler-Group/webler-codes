import request from 'supertest';
import * as bcrypt from "bcryptjs";
import app from '../../src/server';
import {setupTestDatabase, teardownTestDatabase} from '../setup';
import {prisma} from "../../src/services/database";
import R from '../../src/utils/resourceManager';


const loginUser = async (username: string, password: string) =>  await request(app)
    .post('/api/auth/login')
    .send({ username, password });


const logoutUser = async(accessToken: string) => await request(app)
    .post('/api/auth/logout')
    .set('Authorization', `${accessToken}`)
    .expect('Content-Type', /json/)
    .expect(200);


describe('Auth Router', () => {

    let verifiedUser: any;
    let unverifiedUser: any;
    const password = "testing321";

    beforeAll(async () => {
        await setupTestDatabase();
        verifiedUser = await prisma.user.create({
            data: {
                username: 'testuser_v',
                email: 'test_v@example.com',
                password: bcrypt.hashSync(password, 10),
                roles: ['USER'],
                isVerified: true
            }
        });

        unverifiedUser = await prisma.user.create({
            data: {
                username: 'testuser_uv',
                email: 'test_uv@example.com',
                password: bcrypt.hashSync(password, 10),
                roles: ['USER'],
                isVerified: false
            }
        });

    });

    afterAll(async () => {
        await teardownTestDatabase();
    });

    /**
     * These tests are run after authentication
     */
    describe("Post_Auth", () => {
        let accessToken: string;
        let authenticatedId: any;   // likely Bigint or number

        beforeAll(async() => {
            const res = await loginUser(verifiedUser.username, password);

            expect(res.status).toBe(200);
            expect(res.body.userInfo).toHaveProperty("roles", expect.arrayContaining(["USER"]));
            authenticatedId = res.body.userInfo.id;
            accessToken = res.body.accessToken;
        });

        afterAll(async() => {
            await logoutUser(accessToken);
        });

        describe("POST /logout", () => {
            it("should log out the user successfully", async () => {
                const res = await request(app)
                    .post('/api/auth/logout')
                    .set('Authorization', `${accessToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200);

                expect(res.body).toHaveProperty("success", true);
                expect(res.body.message).toBe(R.strings.logged_out_success_msg);
            });

            it("should return 401 if no logout token is provided", async() => {
                const res = await request(app)
                    .post('/api/auth/logout')
                    .expect('Content-Type', /json/)
                    .expect(401);
                expect(res.body).toHaveProperty("message", R.strings.access_token_not_set);
            });

            it("should return 401 if an invalid logout token is provided", async() => {
                const res = await request(app)
                    .post('/api/auth/logout')
                    .set('Authorization', `Bearer invalidToken`)
                    .expect('Content-Type', /json/)
                    .expect(401);

                expect(res.body).toHaveProperty("message", R.strings.access_token_invalid);
            });
        });

        describe("GET /me", () => {
            it("should allow only an authenticated user", async () => {
                const res = await request(app)
                    .get('/api/auth/me')
                    .set('Authorization', `${accessToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200);

                expect(res.body.id).toBe(authenticatedId);
            });

            it("should return 401 if no token is provided", async() => {
                const res = await request(app)
                    .get('/api/auth/me')
                    .expect('Content-Type', /json/)
                    .expect(401);
                expect(res.body).toHaveProperty("message", R.strings.access_token_not_set);
            });

            it("should return 401 if an invalid token is provided", async() => {
                const res = await request(app)
                    .get('/api/auth/me')
                    .set('Authorization', `Bearer invalidToken`)
                    .expect('Content-Type', /json/)
                    .expect(401);

                expect(res.body).toHaveProperty("message", R.strings.access_token_invalid);
            });
        });
    });

    /**
     * The tests are run before/during logging in
     */
    describe("Pre_Auth", () => {
        describe('POST /login', () => {
            it('should log in a user with a email', async () => {
                const res = await request(app)
                    .post('/api/auth/login')
                    .send({ email: verifiedUser.email, password: password });

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('accessToken');
            });

            it('should log in a user with a username', async () => {
                const res = await request(app)
                    .post('/api/auth/login')
                    .send({ username: verifiedUser.username, password });

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('accessToken');
            });

            it('should throw an error if password is incorrect', async () => {
                let res = await request(app)
                    .post('/api/auth/login')
                    .send({ email: verifiedUser.email, password: "wrongPassword"});

                expect(res.status).toBe(400);
                expect(res.body.message).toBe(R.strings.incorrect_password);

                res = await request(app)
                    .post('/api/auth/login')
                    .send({ username: verifiedUser.username, password: "wrongPassword"});
                expect(res.status).toBe(400);
                expect(res.body.message).toBe(R.strings.incorrect_password);
            });

            it('should throw an error if user is not verified', async () => {

                const res = await request(app)
                    .post('/api/auth/login')
                    .send({ email: unverifiedUser.email, password  });

                expect(res.status).toBe(403);
                expect(res.body.message).toBe(R.strings.verify_your_account_msg);
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
                expect(res.body.message).toBe(R.strings.verify_your_account_msg);

                // Check if the user was actually created in the test database
                const user = await prisma.user.findUnique({
                    where: { email: newUser.email }
                });

                expect(user).not.toBeNull();
                expect(user?.email).toBe(newUser.email);
                expect(user?.level).toBe(1);
                expect(user?.xp).toBe(0);
                expect(user?.isVerified).toBe(false);

                const profile = await prisma.profile.findUnique({
                    where: { userId: user?.id }
                });
                expect(profile).toBeNull();
            });

            it('should throw an error if username is already in use', async () => {
                let res = await request(app)
                    .post('/api/auth/register')
                    .send({ username: verifiedUser.username, email: 'new@example.com', password });

                expect(res.status).toBe(400);
                expect(res.body.message).toBe(R.strings.username_is_used);

                res = await request(app)
                    .post('/api/auth/register')
                    .send({ username: unverifiedUser.username, email: 'new@example.com', password });

                expect(res.status).toBe(400);
                expect(res.body.message).toBe(R.strings.username_is_used);
            });


            it('should throw an error if email is already in use', async () => {
                let res = await request(app)
                    .post('/api/auth/register')
                    .send({ username: 'newuser', email: verifiedUser.email, password });

                expect(res.status).toBe(400);
                expect(res.body.message).toBe(R.strings.email_is_used);

                res = await request(app)
                    .post('/api/auth/register')
                    .send({ username: 'newuser', email: unverifiedUser.email, password });

                expect(res.status).toBe(400);
                expect(res.body.message).toBe(R.strings.email_is_used);
            });
        });
    });

});