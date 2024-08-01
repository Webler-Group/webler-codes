import { CodeLanguage } from "@prisma/client";
import { NodeSSH } from "node-ssh";
import { writeLogFile } from "./logger";

const REGISTRY = "ghcr.io/webler-group/";

const dindClient = (function() {
    const ssh = new NodeSSH();

    const runners: { lang: CodeLanguage, image: string }[] = [
        {
            lang: CodeLanguage.C,
            image: "clang"
        },
        {
            lang: CodeLanguage.CS,
            image: "csharp"
        },
        {
            lang: CodeLanguage.CPP,
            image: "clang-cpp"
        }
    ];

    const connect = async () => {
        const config = {
            host: 'dind',
            username: 'root',
            password: 'secret'
        };

        await ssh.connect(config);
        console.log("Connected SSH");
    }

    const login = async (user: string, password: string) => {
        if(!ssh.isConnected()) {
            await connect();
        }
        const result = await ssh.execCommand(`docker login ghcr.io -u ${user} -p ${password}`);
        if(result.code == 0) {
            console.log(result.stdout);
        } else {
            writeLogFile(result.stderr);
        }
    }

    const pullImages = async () => {
        if(!ssh.isConnected()) {
            await connect();
        }
        
        for(let runner of runners) {
            const result = await ssh.execCommand(`docker pull ${REGISTRY}${runner.image}:latest`);
            if(result.code == 0) {
                console.log(result.stdout);
            } else {
                writeLogFile(result.stderr);
            }
        }
    }

    const getRunner = (language: CodeLanguage) => {
        return runners.find(runner => runner.lang == language) ?? null;
    }

    const evaluateCode = async (image: string, source: string, input: string, exectime: number) => {
        if(!ssh.isConnected()) {
            await connect();
        }
        const result = await ssh.exec(`docker run --rm -m 256m --memory-reservation=128m --cpus=1 -q ${REGISTRY}${image}:latest ${exectime}s`, [input, source], { stream: 'both'});

        return result;
    }

    const disconnect = () => {
        ssh.dispose();
    }

    return {
        connect,
        login,
        pullImages,
        evaluateCode,
        getRunner,
        disconnect
    }
})();

export {
    dindClient
}