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

    return {
        connect
    }
})();

export {
    dindClient
}