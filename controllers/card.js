const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find({}).populate('owner');
    if (card) {
      res.status(200).send(card);
    } else {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
  } catch (err) {
    res.status(500).send({ massage: err.message });
  }

  // .then((cards) => res.status(200).send({ data: cards }))
  // .catch((err) => res.status(500).send({ massage: err.message }));
};

module.exports.postCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    if (card) {
      res.status(201).send(card);
    } else {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
  } catch (err) {
    res.status(500).send({ massage: err.message });
  }

  // .then((cards) => res.status(201).send({ cards }))
  // .catch((err) => res.status(500).send({ massage: err.message }));
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params._id);
    if (card) {
      res.status(200).send(card);
    } else {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }

  // .populate('owner')
  // .then((cards) => res.status(200).send(cards))
  // .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.putLikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .populate('owner');
    if (!card._id) {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    } else {
      res.status(200).send(card);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    res.status(500).send({ massage: err.message });
  }
  // Card.findByIdAndUpdate(
  //   req.params._id,
  //   { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  //   { new: true },
  // )
  //   .populate('owner')
  //   .then((cards) => res.status(200).send(cards))
  //   .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteLikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .populate('owner');
    if (!card._id) {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    } else {
      res.status(200).send(card);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    res.status(500).send({ massage: err.message });
  }

  // if (card) {
  //     res.status(200).send(card);
  //   } else {
  //     res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
  //  res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
  //   }
  // } catch (err) {
  //   res.status(500).send({ message: err.message });
  // }

  // Card.findByIdAndUpdate(
  //   req.params._id,
  //   { $pull: { likes: req.user._id } }, // убрать _id из массива
  //   { new: true },
  // )
  //   .populate('owner')
  //   .then((cards) => res.status(200).send(cards))
  //   .catch((err) => res.status(500).send({ message: err.message }));
};