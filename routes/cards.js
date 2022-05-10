const router = require('express').Router();
const {
  getCards, postCard, deleteCard, putLikeCard, deleteLikeCard,
} = require('../controllers/card');

router.get('/', getCards);
router.post('/', postCard);
router.delete('/:_id', deleteCard);
router.put('/:_id/likes', putLikeCard);
router.delete('/:_id/likes', deleteLikeCard);

module.exports = router;
