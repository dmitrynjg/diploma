const userController = require('../controllers/users');
import express from 'express';
import { isAuth, isNotAuth } from '../middlewares/auth';
import passport from 'passport';

const userRouter = express();
userRouter.get('/api/get/user', isAuth(), (req, res) => {
  return res.send(req.user,1);
});
userRouter.get(
  '/google',
  isNotAuth((req, res) => res.redirect('../../')),
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }),
  userController.signin
);



export default userRouter;
