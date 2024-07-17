import { z } from 'zod';
import { 
    registerSchema, 
    loginSchema, 
    resendEmailVerificationCodeSchema, 
    verifyEmailSchema 
} from '../authSchemas'

describe('Zod Schemas', () => {
    describe('registerSchema', () => {
        it('should validate correct inputs', () => {
            const validData = {
                username: 'validUser',
                email: 'user@example.com',
                password: 'StrongPassword123!'
            };

            expect(() => registerSchema.parse(validData)).not.toThrow();
        });

        it('should invalidate incorrect email format', () => {
            const invalidEmailData = {
                username: 'validUser',
                email: 'userexample.com',
                password: 'StrongPassword123!'
            };

            expect(() => registerSchema.parse(invalidEmailData)).toThrow();
        });

        it('should invalidate email with forbidden domain', () => {
            const invalidDomainData = {
                username: 'validUser',
                email: 'user@weblercodes.com',
                password: 'StrongPassword123!'
            };

            expect(() => registerSchema.parse(invalidDomainData)).toThrow();
        });

        it('should invalidate missing fields', () => {
            const missingFieldsData = {
                username: 'validUser'
            };

            expect(() => registerSchema.parse(missingFieldsData)).toThrow();
        });
    });

    describe('loginSchema', () => {
        it('should validate correct inputs', () => {
            const validData = {
                email: 'user@example.com',
                password: 'StrongPassword123!'
            };

            expect(() => loginSchema.parse(validData)).not.toThrow();
        });

        it('should invalidate incorrect email format', () => {
            const invalidEmailData = {
                email: 'userexample.com',
                password: 'StrongPassword123!'
            };

            expect(() => loginSchema.parse(invalidEmailData)).toThrow();
        });

        it('should invalidate missing password', () => {
            const missingPasswordData = {
                email: 'user@example.com'
            };

            expect(() => loginSchema.parse(missingPasswordData)).toThrow();
        });
    });

    describe('resendEmailVerificationCodeSchema', () => {
        it('should validate correct inputs', () => {
            const validData = {
                email: 'user@example.com'
            };

            expect(() => resendEmailVerificationCodeSchema.parse(validData)).not.toThrow();
        });

        it('should invalidate incorrect email format', () => {
            const invalidEmailData = {
                email: 'userexample.com'
            };

            expect(() => resendEmailVerificationCodeSchema.parse(invalidEmailData)).toThrow();
        });
    });

    describe('verifyEmailSchema', () => {
        it('should validate correct inputs', () => {
            const validData = {
                email: 'user@example.com',
                code: '123456'
            };

            expect(() => verifyEmailSchema.parse(validData)).not.toThrow();
        });

        it('should invalidate incorrect email format', () => {
            const invalidEmailData = {
                email: 'userexample.com',
                code: '123456'
            };

            expect(() => verifyEmailSchema.parse(invalidEmailData)).toThrow();
        });

        it('should invalidate code with incorrect length', () => {
            const invalidCodeData = {
                email: 'user@example.com',
                code: '12345' // invalid length
            };

            expect(() => verifyEmailSchema.parse(invalidCodeData)).toThrow();
        });

        it('should invalidate missing email', () => {
            const missingEmailData = {
                code: '123456'
            };

            expect(() => verifyEmailSchema.parse(missingEmailData)).toThrow();
        });
    });
});
