import express from 'express';
import bluebird from 'bluebird';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import router from './router';

declare const Promise: bluebird<any>;

const app: express.Application = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'my name is Van',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(router);

app.use((err: any, req: any, res: any, next: any) => next(err));
const port = process.env.PORT || 8080;

app.listen(port, (): void => console.log(`Запущен на ${port} порте`));
