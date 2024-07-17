import { generateRandomFileName } from "../fileUtils";

describe("Return A random string that can be used to name a file", () => {
    const fixedDate = new Date("2024-07-14T00:00:00Z");

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(fixedDate);
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    test("returns a filename containing the date", () => {
        const fileName = generateRandomFileName();
        expect(fileName).toMatch(/^2024-07-14-[a-z0-9]+/);
    });

    test("returns a random fileName each time", () => {
        const fileName1 = generateRandomFileName();
        const fileName2 = generateRandomFileName();
        expect(fileName1).not.toBe(fileName2);
    });

    test("returns unique file name on multiple calls", () => {
        const generatedNames = new Set();
        for (let i = 0; i < 1000; i++) {
            generatedNames.add(generateRandomFileName());
        };

        expect(generatedNames.size).toBe(1000);
    });
});