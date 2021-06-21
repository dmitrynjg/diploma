const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const userModel = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_DEV,
      clientSecret: process.env.GOOGLE_SECRET_DEV,
      callbackURL: 'http://127.0.0.1:3000/google',
    },
    async (accessToken, refreshToken, user, done) => {
      let info = await userModel.findOne({
        raw: true,
        where: {
          email: user._json.email,
        },
      });
      if (!info) {
        info = await userModel
          .create({
            email: user._json.email,
            name: user._json.name || user._json.given_name || user.displayName,
          })
          .then((res) => res.dataValues);
      }
      return done(null, { ...info, avatar: user.photos[0].value });
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
