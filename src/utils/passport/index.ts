import { PassportStatic, Profile } from 'passport';

require('dotenv').config();
const isDev = process.env.NODE_ENV === 'dev';
const passport: PassportStatic = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

passport.use(
  new GoogleStrategy(
    {
      clientID: isDev ? process.env.GOOGLE_CLIENT_ID_DEV : '',
      clientSecret: isDev ? process.env.GOOGLE_SECRET_DEV : '',
      callbackURL: isDev ? 'http://127.0.0.1:8080/google' : '',
    },
    async (accessToken: string, refreshToken: string, userGoogle: Profile, done: Function) => {
      if (userGoogle.emails && userGoogle.emails[0]) {
        const user = await db.fetchObj('SELECT email, name, is_user, user_id FROM users WHERE email = ?', [
          userGoogle.emails[0].value,
        ]);
        if (Object.keys(user).length > 0) {
          return done(null, {
            id: user.user_id,
            email: user.email,
            name: user.name,
            isUser: user.is_user === 1,
          });
        }
        const [insertInfo] = await db.query('INSERT INTO users(email, name) VALUES (?,?)', [
          userGoogle.emails[0].value,
          userGoogle.displayName || '',
        ]);
        return done(null, {
          id: insertInfo.insertId,
          email: userGoogle.emails[0].value,
          name: userGoogle.displayName || '',
          isUser: true,
        });
      }
      return done(null, false);
    }
  )
);

passport.serializeUser((user: any , done:any): void => done(null, user));
passport.deserializeUser((user: Profile, done: any): void => done(null, user));
