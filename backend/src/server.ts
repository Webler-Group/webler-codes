import express from 'express';
import { configDotenv } from 'dotenv';

configDotenv();

const port = process.env.PORT;

const app = express();

app.use(express.json({ limit: "2mb" }));

app.get('/api', (req, res) => {
    res.json({
        message: "Hello World!"
    });
});

app.listen(port, () => {
    console.log(`App started listening on port ${port}.`);
});