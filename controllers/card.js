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
    next(err);
  }
};

module.exports.postCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    let card = await Card.create(
      { name, link, owner: req.user._id },
    );
    card = await card.populate('owner');
    if (card) {
      res.status(201).send(card);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при создании карточки'));
    }
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params._id);
    if (!card) {
      next(new NotFound('Карточка по указанному _id не найдена'));
    }
    if (card.owner.toString() === req.user._id) {
      card.remove();
      res.status(200).send(card);
    } else {
      next(new Forbidden('Нельзя удалять чужие карточки ヽ(`⌒´メ)ノ'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Некорректные данные'));
    }
    next(err);
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
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Некорректные данные'));
    } else {
      next(err);
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
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Некорректные данные'));
    } else {
      next(err);
    }
  }
};
