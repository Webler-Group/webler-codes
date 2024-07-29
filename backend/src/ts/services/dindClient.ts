import { CodeLanguage } from "@prisma/client";
import { NodeSSH } from "node-ssh";

const dindClient = (function() {
    const ssh = new NodeSSH();

    const connect = async () => {
        const config = {
            host: 'dind',
            username: 'root',
            password: 'secret'
        };

        await ssh.connect(config);
    }

    const dockerLogin = async (user: string, password: string) => {
        await ssh.execCommand(`docker login -u ${user} -p ${password}`);
    }

    const evaluateCode = async (lang: CodeLanguage, source: string, input: string) => {
        const result = await ssh.execCommand(`docker run --rm ghcr.io/webler-group/clang ${source} ${input}`);
        return result;
    }

    const disconnect = () => {
        ssh.dispose();
    }

    return {
        connect,
        dockerLogin,
        evaluateCode,
        disconnect
    }
})();

export {
    dindClient
}