const userController = require('../controllers/users');
const express = require('express');
const { isAuth, isNotAuth } = require('../middlewares/auth');
const passport = require('passport');

const userRouter = express();
userRouter.get('/api/get/user', isAuth(), (req, res) => {
  return res.send(req.user);
});
userRouter.get(
  '/google',
  isNotAuth((req, res) => res.redirect('../../')),
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }),
  userController.signin
);

module.exports = userRouter;
