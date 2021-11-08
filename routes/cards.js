const express = require('express');
const _ = require('lodash');
const { Card, validateCard, generateBizNumber } = require('../models/card');
const auth = require('../middleware/auth');
const router = express.Router();

router.delete('/:id/:userId', auth, async (req, res) => {
  console.log('delete id', req.params);
  const card = await Card.findOneAndRemove({ _id: req.params.id, user_id: req.params.userId });
  if (!card) return res.status(404).send('The card with the given ID was not found.');
  res.send(card);

});

router.put('/:id', auth, async (req, res) => {
  console.log('put id', req.body);
  const { error } = validateCard(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let card = await Card.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, req.body);
  if (!card) return res.status(404).send('The card with the given ID was not found.');

  card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
  res.send(card);

});



router.get('/my-cards', auth, async (req, res) => {
  const cards = await Card.find()
  // const cards = await getCards();
  res.send(cards);

});


router.get('/:id', auth, async (req, res) => {
  const card = await Card.findOne({ _id: req.params.id });
  if (!card) return res.status(404).send('The card with the given ID was not found.');
  res.send(card);

});

router.post('/', auth, async (req, res) => {
  console.log('body', req.body)
  const { error } = validateCard(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  let card = new Card(
    {
      bizName: req.body.bizName,
      bizDescription: req.body.bizDescription,
      bizAddress: req.body.bizAddress,
      bizPhone: req.body.bizPhone,
      bizImage: req.body.bizImage,
      bizNumber: await generateBizNumber(Card),
      user_id: req.user._id,
      category: req.body.category,
      rate: req.body.rate,
    }
  );
  post = await card.save();
  res.send(post);

});

module.exports = router;