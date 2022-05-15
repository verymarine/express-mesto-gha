// const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const express = require('express');

const router = express.Router();

const {
  getUsers, getUserId, patchUser, patchUserAvatar, getUser,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/me', getUser);

router.get('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), getUserId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i),
  }),
}), patchUserAvatar);

module.exports = router;
