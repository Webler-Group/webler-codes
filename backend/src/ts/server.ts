import express from 'express';
import { API_PREFIX, BACKEND_PORT, DOCKER_PASSWORD, DOCKER_USER } from './utils/globals';
import authRouter from './routes/authRouter';
import { errorMiddleware } from './middleware/errorMiddleware';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter';
import codeRouter from './routes/codeRouter';
import NotFoundException from './exceptions/NotFoundException';
import { ErrorCode } from './exceptions/enums/ErrorCode';
import { reportRouter } from './routes/reportRouter';
import discussionRouter from './routes/discussionRouter';
import { dindClient } from './services/dindClient';

const main = async () => {
    const app = express();

    app.use(express.json({ limit: '2mb' }));
    app.use(cookieParser());

    app.use(`${API_PREFIX}/auth`, authRouter);
    app.use(`${API_PREFIX}/user`, userRouter);
    app.use(`${API_PREFIX}/code`, codeRouter);
    app.use(`${API_PREFIX}/reports`, reportRouter);
    app.use(`${API_PREFIX}/discussion`, discussionRouter);

    app.get('*', (req, res, next) => {
        next(new NotFoundException('Route does not exist', ErrorCode.ROUTE_NOT_FOUND));
    });

    app.use(errorMiddleware);

    await dindClient.login(DOCKER_USER, DOCKER_PASSWORD);
    await dindClient.updateImages();

    app.listen(BACKEND_PORT, () => {
        console.log(`App listening on ${BACKEND_PORT}`);
    });

    dindClient.disconnect();
}

main();
