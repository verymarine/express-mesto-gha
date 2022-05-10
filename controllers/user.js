// const ValidationError = require('../errors/SomeErrorName');
const User = require('../models/user');
// const ERROR_CODE = 400;

module.exports.getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    if (user) {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
  // .then((users) => res.send({ data: users }))
  // .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.postUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create(
      { name, about, avatar },
      // { runValidators: true },
    );
    if (user) {
      res.status(201).send(user);
      return;
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      return;
    }
    res.status(500).send({ message: err.message });
  }
};

module.exports.patchUser = async (req, res) => {
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
      res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при изменении пользователя' });
      return;
    }
    res.status(500).send({ message: err.message });
  }
};

module.exports.patchUserAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true },
    );
    if (!user._id) {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при изменении пользователя' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};
