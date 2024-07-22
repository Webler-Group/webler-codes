import {
    NODE_ENV,
    BACKEND_PORT,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASSWORD,
    API_PREFIX,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    LOG_DIR,
    ADMIN_EMAIL,
    ADMIN_PASSWORD
} from '../../ts/utils/globals';

describe('Globals', () => {
    it('should have NODE_ENV set', () => {
        expect(NODE_ENV).toBeDefined();
        expect(['test', 'development', 'production'].includes(NODE_ENV)).toBe(true);
    });

    it('should have BACKEND_PORT set', () => {
        expect(BACKEND_PORT).toBeDefined();
    });

    it('should have EMAIL_HOST set', () => {
        expect(EMAIL_HOST).toBeDefined();
    });

    it('should have EMAIL_PORT set', () => {
        expect(EMAIL_PORT).toBeDefined();
    });

    it('should have EMAIL_SECURE set as a boolean', () => {
        expect(EMAIL_SECURE).toBeDefined();
        expect(typeof EMAIL_SECURE).toBe('boolean');
    });

    it('should have EMAIL_USER set', () => {
        expect(EMAIL_USER).toBeDefined();
    });

    it('should have EMAIL_PASSWORD set', () => {
        expect(EMAIL_PASSWORD).toBeDefined();
    });

    it('should have API_PREFIX set', () => {
        expect(API_PREFIX).toBeDefined();
        expect(API_PREFIX).toBe('/api');
    });

    it('should have ACCESS_TOKEN_SECRET set', () => {
        expect(ACCESS_TOKEN_SECRET).toBeDefined();
    });

    it('should have REFRESH_TOKEN_SECRET set', () => {
        expect(REFRESH_TOKEN_SECRET).toBeDefined();
    });

    it('should have LOG_DIR set', () => {
        expect(LOG_DIR).toBeDefined();
    });

    it('should have ADMIN_EMAIL set', () => {
        expect(ADMIN_EMAIL).toBeDefined();
    });

    it('should have ADMIN_PASSWORD set', () => {
        expect(ADMIN_PASSWORD).toBeDefined();
    });
});
