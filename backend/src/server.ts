import express from 'express';
import { API_PREFIX, APP_PORT } from './utils/globals';
import authRouter from './routes/authRoute';
import { errorMiddleware } from './middleware/errorMiddleware';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.use(`${API_PREFIX}/auth`, authRouter);

app.use(errorMiddleware);

app.get('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.listen(APP_PORT, () => {
    console.log(`App listening on ${APP_PORT}`);
});