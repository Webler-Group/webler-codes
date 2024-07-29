import { execSync } from 'child_process';
import R from '../utils/resourceManager';

export const testWithDescription = (args: any) => {
    const testWhat = args.description || '';
    execCmd("Running test for: " + testWhat, `npx jest -t ${testWhat}`);
}

export const testWithOption_1 = (args: any) => {
    const testWhat = args.directory || '';
    if(testWhat === '') {
        execCmd("Running all tests", "npx jest");
        return;
    }
    const isWholeDirectory = testWhat.indexOf(".") < 0;
    if(isWholeDirectory) {
        execCmd("Running all tests in the directory: " + testWhat, `npx jest /ts/test/${testWhat}`);
        return;
    }

    const [dir, file] = testWhat.split(".");
    execCmd("Running test for: " + file, `npx jest /ts/test/${dir}/${file}.test.ts`);
    
}

export const launchShellWithOption_1 = (args: any) => {
    const options = {
        "docker-backend": {
            desc: "Launching shell in docker backend",
            cmd: "docker exec -it webler-codes-backend sh"
        },
        "node": {
            desc: "opening node shell",
            cmd: "node"
        }
    };
    execOptional_1(args, options);
}


export const launchWithOption_1 = (args: any) => {
    const options = {
        "docker": {
            desc: "Launching docker",
            cmd: "docker stop $(docker ps -q); docker compose -f ../docker-compose-dev.yaml up"
        },
        "server": {
            desc: "Launching server",
            cmd: "node dist/ts/src/server.js"
        },
        "devserver": {
            desc: "Launching devserver",
            cmd: "nodemon ts/src/server.ts"
        }
    };
    execOptional_1(args, options);
}



export const buildWithOption_1 = (args: any) => {
    const options: {[key: string]: {
        desc: string,
        cmd: string,
    }} = {
        "typescript": {
            desc: "Building Typescript",
            cmd: "ts-node ./ts/src/cli/RCompiler.ts && tsc"
        },
        "docker": {
            desc: "Building docker",
            cmd: "docker stop $(docker ps -q); docker compose -f ../docker-compose-dev.yaml up --build --force-recreate"
        }
    };
    execOptional_1(args, options);
}


function execOptional_1(args: any, options: {[key: string]: {desc: string, cmd: string }}) {
    const testWhat = args.what || '';
    if (!(options.hasOwnProperty(testWhat))) {
        console.log(R.strings.invalid_cmd_option);
        for(const option in options) console.log(option);
        return;
    }
    execCmd(options[testWhat].desc, options[testWhat].cmd);
}

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