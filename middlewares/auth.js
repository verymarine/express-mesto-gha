const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  // if (!authorization || !authorization.startsWith('Bearer ')) {

  if (!token) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  // const token = authorization.replace('Bearer ', '');
  let payload;
  // верифицируем токен
  // const payload = jwt.verify(token, 'some-secret-key');
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
