import fs from "fs";
import path from "path"
import { generateRandomFileName } from "./fileUtils";

const PARENT_DIR = path.resolve("../");

const ENV_PATH = path.join(PARENT_DIR, "backend/.env");


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

        expect(generatedNames.size).toBe(1);
    });
});



describe("Ensure that .env file is configured", () => {

    let envFileExist = true;
    const envVar: {[key: string]: any} = {};

    try {
        const fileContent = fs.readFileSync(ENV_PATH, "utf-8");
        fileContent.split("\n")
            .map(i => i.trim())
            .filter(i => i !== "")
            .forEach(it => {
                const [key, value] = it.split("=");
                envVar[key] = value;
            });
    } catch {
        envFileExist = false;
    }

    test(".env file exists", () => {
        expect(envFileExist).toBe(true);
    });

    test(".env config for development", () => {
        expect(envVar["SERVER_NAME"]).toBe("localhost");
        expect(envVar["BACKEND_PORT"]).toBe("1234");
        expect(envVar["DATABASE_URL"]).toMatch("postgresql://webler_user:secret@postgres:5432/webler_codes_localhost_db?schema");
        expect(envVar["EMAIL_USER"]).toMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        expect(envVar["EMAIL_PASSWORD"]).toMatch(/^[a-zA-Z0-9]{4} [a-zA-Z0-9]{4} [a-zA-Z0-9]{4} [a-zA-Z0-9]{4}$/);
        expect(envVar["EMAIL_SECURE"]).toBe("false");
        expect(envVar["EMAIL_PORT"]).toBe("587");
        expect(envVar["ACCESS_TOKEN_SECRET"]).toBe("secret1");
        expect(envVar["REFRESH_TOKEN_SECRET"]).toBe("secret2");
        expect(envVar["LOG_DIR"]).toBe("logs");
    });

});