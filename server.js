const express = require('express');
const Bluebird = require('bluebird');
global.Promise = Bluebird;
const compression = require('compression');
const passport = require('passport');
require('./modules/passport');
const register = require('@react-ssr/express/register');
const router = require('./routers/index');
const session = require('express-session');
const cookieSession = require('cookie-session');

const server = express();

(async () => {
  await register(server);
  server.use(
    cookieSession({
      name: 'session',
      keys: ['secret'],
      maxAge: 24 * 60 * 60 * 1000,
    })
  );
  // server.use(
  //   session({
  //     secret: 'secret',
  //     resave: true,
  //     secure: true,
  //     saveUninitialized: true,
  //   })
  // );

  server.use(express.urlencoded({ extended: false, limit: '50mb' }));
  server.use(express.json({ limit: '50mb' }));
  server.use(compression());
  server.use(passport.initialize());
  server.use(passport.session());
  server.use('/uploads', express.static('./uploads'));
  server.use(router);
  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порте`));
})();
