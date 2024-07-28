import { execSync } from 'child_process';


export const openCmdInBackendDockerContainer = (): void => execCmd("Opening command line in backend container",
    "docker exec -it webler-codes-backend sh");

export const buildDocker = (): void => execCmd("Rebuilding Docker",
    "docker stop $(docker ps -q); docker compose -f docker-compose-dev.yaml up --build --force-recreate");

export const launchDocker = (): void => execCmd("Launching Docker", "docker stop $(docker ps -q); " +
    "docker compose -f docker-compose-dev.yaml up");

export const seedDatabase = (): void => execCmd("Seeding Database", "src-node src/src/cli/seed.src");

export const buildTypescript = (): void => execCmd("Building typsecript", "tsc");

export const startServer = (): void => execCmd("Starting server...", "node dist/src/server.js");

export const devStartServer = (): void => execCmd("Starting dev server...", "nodemon src/src/server.src");


/**
 * This function executes command line's command
 * @param desc is the description of the command
 * @param cmd is the command to be run
 * for example: `execCmd("Starting server...", "node path/to/server.js")
 */
const execCmd = (desc: string, cmd: string): void => {
    try {
        console.log(desc);
        execSync(`${cmd}`, { stdio: "inherit" });
    } catch(error) {
        console.error(`Error ${desc}`, error);
    }
}