const express = require('express');
const Bluebird = require('bluebird');
global.Promise = Bluebird;
const compression = require('compression');
const passport = require('passport');
require('./modules/passport');
const register = require('@react-ssr/express/register');
const router = require('./routers/index');
const session = require('express-session');


const server = express();
(async () => {
  await register(server);
  server.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
    })
  );
  server.use(express.urlencoded({ extended: false }));
  server.use(express.json());
  server.use(compression());
  server.use(passport.initialize());
  server.use(passport.session());
  server.use('/uploads', express.static('./uploads'));
  server.use(router);
  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порте`));
})();
