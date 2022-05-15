const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const Card = require('../models/card');

module.exports.getCards = async (req, res, next) => {
  try {
    const card = await Card.find({}).populate('owner');
    if (card) {
      res.status(200).send(card);
    }
  } catch (err) {
    // res.status(500).send({ message: err.message });
    next(err);
  }
};

module.exports.postCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    let card = await Card.create(
      { name, link, owner: req.user._id },
      // { runValidators: true },
    );
    card = await card.populate('owner');
    if (card) {
      res.status(201).send(card);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при создании карточки'));
      // res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      // return;
    }
    // res.status(500).send({ message: err.message });
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params._id);
    if (card.owner.toString() === req.user._id) {
      res.status(200).send(card);
      card.remove();
    } else {
      next(new Forbidden('Нельзя удалять чужие карточки ヽ(`⌒´メ)ノ'));
      // res.status(404).send({ message: 'Вы не имеете прав на удаления' });
      // return;
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

module.exports.putLikeCard = async (req, res, next) => {
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
      next(new NotFound('Карточка по указанному _id не найдена'));
      // res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
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

module.exports.deleteLikeCard = async (req, res, next) => {
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
      next(new NotFound('Карточка по указанному _id не найдена'));
      // res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
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
