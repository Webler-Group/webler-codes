import express from 'express';
import { API_PREFIX, BACKEND_PORT } from './utils/globals';
import authRouter from './routes/authRouter';
import { errorMiddleware } from './middleware/errorMiddleware';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter';
import NotFoundException from './exceptions/NotFoundException';
import { ErrorCode } from './exceptions/enums/ErrorCode';
import { reportRouter } from './routes/reportRouter';

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/user`, userRouter);
app.use(`${API_PREFIX}/reports`, reportRouter);

app.get('*', (req, res, next) => {
    next(new NotFoundException('Route does not exist', ErrorCode.ROUTE_NOT_FOUND))
});

app.use(errorMiddleware);

app.listen(BACKEND_PORT, () => {
    console.log(`App listening on ${BACKEND_PORT}`);
});