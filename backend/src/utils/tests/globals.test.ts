/**
 * @file globals.test.ts
 * @date 15th JUly, 2024
 * 
 * This test should be run occasionally to ensure that the backend/.env file
 * is appropriately written for development to proceed smoothly.
 * 
 * Except you know what you are doing, you shouldn't change any implementation 
 * or regex pattern or variable in this source file.
 */
import fs from "fs";
import path from "path";


const BASE_DIR = path.resolve("../");

const ENV_PATH = path.join(BASE_DIR, "backend/.env");


describe("Ensure that .env file is configured", () => {

    let envFileExist = true;
    const envVar: {[key: string]: any} = {};

    // console.log(ENV_PATH); 

    try {
        // get the content of the backend/.env file
        const fileContent = fs.readFileSync(ENV_PATH, "utf-8");

        // read it as a string and initialize a dictionary object from it
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

    test(".env config variable types", () => {
        expect(envVar["BACKEND_PORT"]).toMatch(/[0-9]+/);
        expect(envVar["EMAIL_PORT"]).toMatch(/[0-9]+/);
    });

});