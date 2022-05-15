const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');
// const ERROR_CODE = 400;
const MONGO_DUBLICATE_ERROR_CODE = 11000;

module.exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find({});
    if (user) {
      res.status(200).send(user);
    }
  } catch (err) {
    next(err);
    // res.status(500).send({ message: err.message });
  }
};

module.exports.getUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id);
    if (user) {
      res.status(200).send(user);
    } else {
      next(new NotFound('Пользователь по указанному _id не найден'));
      // res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Некорректные данные'));
      // res.status(400).send({ message: 'Некорректные данные' });
    } else {
      next(err);
      // res.status(500).send({ message: err.message });
    }
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).send(user);
    } else {
      next(new NotFound('Пользователь по указанному _id не найден'));
      // res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Некорректные данные'));
      // res.status(400).send({ message: 'Некорректные данные' });
    } else {
      next(err);
      // res.status(500).send({ message: err.message });
    }
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!email || !password) {
      next(new BadRequest('Неправильные почта или пароль'));
      // res.status(400).send({ message: 'Неправильные почта или пароль' });
    }
    bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          next(new BadRequest('Неправильные почта или пароль'));
          // res.status(400).send({ message: 'Неправильные почта или пароль' });
        }
        // const token = generateToken({_id: user._id})
        const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });// напишите код здесь

        res.cookie('token', token, {
          httpOnly: true,
          sameSite: true,
        });

        res.status(200).send({ token });
      });
    // const matched = bcrypt.compare(password, user.password);
    // if (!matched) {
    //   res.status(400).send({ message: 'Неправильные почта или пароль' });
    // }
    // const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
    // res.status(200).send({ token });
  } catch (err) {
    next(new Unauthorized('Пользователь не найден'));
    // res.status(401).send({ message: err.message });
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    if (!email || !password) {
      next(new BadRequest('Неверный email или пароль'));
      // res.status(400).send({ message: 'Ошибка введеных данных' });
    } else {
      res.status(201).send(user);
    }
  } catch (err) {
    if (err.code === MONGO_DUBLICATE_ERROR_CODE) {
      next(new Conflict('Пользователь уже существует'));
      // res.status(409).send({ message: 'Пользователь уже существует' });
    }
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      // res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      next(err);
      // res.status(500).send({ message: err.message });
    }
  }
};

module.exports.patchUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, about: req.body.about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (user) {
      res.status(200).send(user);
    } else {
      next(new NotFound('Пользователь по указанному _id не найден'));
      // res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при изменении пользователя'));
      // res.status(400).send({ message: 'Переданы некорректные данные' });
      // return;
    }
    next(err);
    // res.status(500).send({ message: err.message });
  }
};

module.exports.patchUserAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true },
    );
    if (!user._id) {
      next(new NotFound('Пользователь по указанному _id не найден'));
      // res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при изменении пользователя'));
      // res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      next(err);
      // res.status(500).send({ message: err.message });
    }
  }
};
