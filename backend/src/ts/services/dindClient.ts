import { CodeLanguage } from "@prisma/client";
import { NodeSSH } from "node-ssh";

const REGISTRY = "ghcr.io/webler-group/";

const dindClient = (function() {
    const ssh = new NodeSSH();

    const runners: { lang: CodeLanguage, image: string, ready: boolean }[] = [
        {
            lang: CodeLanguage.C,
            image: "clang",
            ready: false
        },
        {
            lang: CodeLanguage.CS,
            image: "csharp",
            ready: false
        }
    ];

    const connect = async () => {
        const config = {
            host: 'dind',
            username: 'root',
            password: 'secret'
        };

        await ssh.connect(config);
    }

    const login = async (user: string, password: string) => {
        if(!ssh.isConnected()) {
            await connect();
        }
        const result = await ssh.execCommand(`docker login ghcr.io -u ${user} -p ${password}`);
    }

    const updateImages = async () => {
        if(!ssh.isConnected()) {
            await connect();
        }
        
        for(let runner of runners) {
            const result = await ssh.execCommand(`docker pull ${REGISTRY}${runner.image}:latest`);
            if(result.code == 0) {
                runner.ready = true;
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
        const result = await ssh.exec(`timeout -s 9 ${exectime}s docker run --rm -m 256m --memory-reservation=128m --cpus=1 ${REGISTRY}${image}:latest`, [source, input], { stream: 'both'});
        return result;
    }

    const disconnect = () => {
        ssh.dispose();
    }

    return {
        connect,
        login,
        updateImages,
        evaluateCode,
        getRunner,
        disconnect
    }
})();

export {
    dindClient
}