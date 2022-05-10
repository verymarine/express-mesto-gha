const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find({}).populate('owner');
    if (card) {
      res.status(200).send(card);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.postCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create(
      { name, link, owner: req.user._id },
      // { runValidators: true },
    );
    if (card) {
      res.status(201).send(card);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      return;
    }
    res.status(500).send({ message: err.message });
  }
};

module.exports.deleteCard = async (req, res) => {
  // const card = await Card.findByIdAndRemove(req.params._id).populate('owner');
  try {
    const card = await Card.findByIdAndRemove(req.params._id).populate('owner');
    if (card) {
      res.status(200).send(card);
    } else {
      res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
      return;
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.putLikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate('owner');
    if (card) {
      res.status(200).send(card);
    } else {
      res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.deleteLikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate('owner');
    if (card) {
      res.status(200).send(card);
    } else {
      res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};
