import express from "express";
import userRouter from './routes/user';
import toursRouter from './routes/tours';

const app: express.Application = express();

app.use(userRouter);
app.use(toursRouter);

export = app;
