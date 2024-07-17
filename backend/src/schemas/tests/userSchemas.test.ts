import { z } from 'zod';
import { followSchema } from '../userSchemas'; // replace with your actual module path
import { idSchema } from '../typeSchemas'; // replace with your actual module path

// Mocking the idSchema
jest.mock('../typeSchemas', () => ({
    idSchema: z.string().uuid() // Example: assuming idSchema expects a UUID string
}));

describe('followSchema', () => {
    it('should validate correct inputs', () => {
        const validData = {
            userId: 'd3b07384-d9a3-4e7a-9f0f-5e7b2e43c3c5',
            isFollow: true
        };

        expect(() => followSchema.parse(validData)).not.toThrow();
    });

    it('should invalidate incorrect userId format', () => {
        const invalidUserIdData = {
            userId: 'not-a-uuid',
            isFollow: true
        };

        expect(() => followSchema.parse(invalidUserIdData)).toThrow();
    });

    it('should invalidate missing userId', () => {
        const missingUserIdData = {
            isFollow: true
        };

        expect(() => followSchema.parse(missingUserIdData)).toThrow();
    });

    it('should invalidate incorrect isFollow type', () => {
        const invalidIsFollowData = {
            userId: 'd3b07384-d9a3-4e7a-9f0f-5e7b2e43c3c5',
            isFollow: 'not-a-boolean'
        };

        expect(() => followSchema.parse(invalidIsFollowData)).toThrow();
    });

    it('should invalidate missing isFollow', () => {
        const missingIsFollowData = {
            userId: 'd3b07384-d9a3-4e7a-9f0f-5e7b2e43c3c5'
        };

        expect(() => followSchema.parse(missingIsFollowData)).toThrow();
    });

    it('should invalidate extra fields', () => {
        const extraFieldsData = {
            userId: 'd3b07384-d9a3-4e7a-9f0f-5e7b2e43c3c5',
            isFollow: true,
            extraField: 'extra'
        };

        expect(() => followSchema.parse(extraFieldsData)).toThrow();
    });

    it('should validate false for isFollow', () => {
        const validData = {
            userId: 'd3b07384-d9a3-4e7a-9f0f-5e7b2e43c3c5',
            isFollow: false
        };

        expect(() => followSchema.parse(validData)).not.toThrow();
    });
});
