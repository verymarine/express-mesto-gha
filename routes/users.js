// const router = require('express').Router();

const express = require('express');

const router = express.Router();

const {
  getUsers, getUserId, postUser, patchUser, patchUserAvatar,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/:_id', getUserId);
router.post('/', postUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
