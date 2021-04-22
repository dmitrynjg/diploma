import express from 'express';
import passport from 'passport';
import '../utils/passport';
// import userController from '../controllers/user';

const app = express();

app.use(passport.initialize());
app.use(passport.session());

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }));

export = app;
