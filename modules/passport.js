const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_DEV,
      clientSecret: process.env.GOOGLE_SECRET_DEV,
      callbackURL: 'http://127.0.0.1:3000/google',
    },
    (accessToken, refreshToken, userGoogle, done) => done(null, { ...userGoogle, email: userGoogle._json.email })
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
