import R from '../../src/utils/resourceManager';
import {generateRandomFileName, bigintToNumber } from '../../src/utils/utils';

describe('Utils', () => {
    describe("get string res", () => {
        it("Ensure strings are retrived from locale=en", async() => {
            expect(R.strings.appname).toBe("Webler");
        })
    })

    describe('generateRandomFileName', () => {
        it('should generate a string in the expected format', () => {
            const fileName = generateRandomFileName();
            const regex = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3}-\d{6}$/;
            expect(fileName).toMatch(regex);
        });

        it('should generate unique file names', () => {
            const fileName1 = generateRandomFileName();
            const fileName2 = generateRandomFileName();
            expect(fileName1).not.toBe(fileName2);
        });
    });

    describe('bigintToNumber', () => {
        it('should return null for null input', () => {
            const result = bigintToNumber(null);
            expect(result).toBeNull();
        });

        it('should return the same date object for date input', () => {
            const date = new Date();
            const result = bigintToNumber(date);
            expect(result).toBe(date);
        });

        it('should convert a bigint to a number', () => {
            const bigIntValue = BigInt(123456789);
            const result = bigintToNumber(bigIntValue);
            expect(result).toBe(123456789);
            expect(typeof result).toBe('number');
        });

        it('should handle an array with mixed types', () => {
            const input = [BigInt(123), 456, '789'];
            const result = bigintToNumber(input);
            expect(result).toEqual([123, 456, '789']);
        });

        it('should handle an object with mixed types', () => {
            const input = {
                a: BigInt(123),
                b: 456,
                c: '789'
            };
            const result = bigintToNumber(input);
            expect(result).toEqual({
                a: 123,
                b: 456,
                c: '789'
            });
        });

        it('should handle nested structures', () => {
            const input = {
                a: BigInt(123),
                b: [BigInt(456), { c: BigInt(789), d: '123' }],
                e: { f: BigInt(321), g: [BigInt(654), '987'] }
            };
            const result = bigintToNumber(input);
            expect(result).toEqual({
                a: 123,
                b: [456, { c: 789, d: '123' }],
                e: { f: 321, g: [654, '987'] }
            });
        });

        it('should handle very large bigint values', () => {
            const bigIntValue = BigInt('9007199254740991'); // MAX_SAFE_INTEGER
            const result = bigintToNumber(bigIntValue);
            expect(result).toBe(Number(bigIntValue));
        });

        it('should handle values that are not objects or bigints', () => {
            const input = 123;
            const result = bigintToNumber(input);
            expect(result).toBe(123);
            expect(typeof result).toBe('number');
        });
    });
});
