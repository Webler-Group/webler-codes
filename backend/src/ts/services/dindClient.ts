import { CodeLanguage } from "@prisma/client";
import { NodeSSH } from "node-ssh";
import { DOCKER_PASSWORD, DOCKER_USER } from "../utils/globals";

const dindClient = (function() {
    const ssh = new NodeSSH();

    const connect = async () => {
        const config = {
            host: 'dind',
            username: 'root',
            password: 'secret'
        };

        await ssh.connect(config);

        console.log(`Connected: ${ssh.isConnected()}`);
    }

    const dockerLogin = async (user: string, password: string) => {
        console.log(user, password);
        
        const result = await ssh.execCommand(`docker login ghcr.io -u ${user} -p ${password}`);
        console.log(result);
        
    }

    const evaluateCode = async (lang: CodeLanguage, source: string, input: string) => {
        console.log(`Connected: ${ssh.isConnected()}`);
        const compilers=new Map();
        compilers.set(CodeLanguage.C, "clang");
        compilers.set(CodeLanguage.CPP, "clang-cpp");
        compilers.set(CodeLanguage.LISP, "clojure");
        if(!ssh.isConnected()) {
            await connect();
            await dockerLogin(DOCKER_USER, DOCKER_PASSWORD);
        }
        try {
            const result = await ssh.exec(`docker run --rm ghcr.io/webler-group/${compilers.get(lang)}`, [source, input]);
            return { stdout: result ?? "No output" };
        } catch(error: any) {
            return { stderr: error.message }
        }
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
