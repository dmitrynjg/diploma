const isAuth =
  (cb = (req, res) => res.send({ ok: false, message: 'Вы не авторизованы' })) =>
  (req, res, next) => {
    if (req.user) {
      return next();
    }
    return cb(req, res, next);
  };
const isNotAuth =
  (cb = (req, res) => res.send({ ok: false, message: 'Вы авторизованы' })) =>
  (req, res, next) => {
    if (!req.user) {
      return next();
    }
    return cb(req, res, next);
  };
  
module.exports = { isAuth, isNotAuth };
