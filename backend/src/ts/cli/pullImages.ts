import { dindClient } from "../services/dindClient";
import { DOCKER_PASSWORD, DOCKER_USER } from "../utils/globals";

const main = async () => {
    await dindClient.login(DOCKER_USER, DOCKER_PASSWORD);
    await dindClient.pullImages();
}
main();