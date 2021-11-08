const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate, validateCards } = require('../models/user');
const { Card } = require('../models/card');
const auth = require('../middleware/auth');
const router = express.Router();

const getCards = async (cardsArray) => {
  const cards = await Card.find({ "bizNumber": { $in: cardsArray } });
  return cards;
};


router.patch('/cards', auth, async (req, res) => {

  const { error } = validateCards(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const cards = await getCards(req.body.cards);
  if (cards.length != req.body.cards.length) res.status(400).send("Card numbers don't match");

  let user = await User.findById(req.user._id);
  user.cards = req.body.cards;
  user = await user.save();
  res.send(user);

});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.get('/loggedUser', async (req, res) => {
  if (req.body) {
    const user = await User.findById(req.body._id)
    res.send(user);
  } else {
    res.send(null);
  }
});


router.post('/', async (req, res) => {
  console.log('bodybody', req.body);
  const { error } = validate(req.body);
  console.log({ error });
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  console.log({ user });
  if (user) return res.status(400).send('User already registered.');
  user = new User(_.pick(req.body, ['name', 'email', 'password', 'biz', 'cards']));
  console.log({ user });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ['_id', 'name', 'email']));

});



router.put('/:id', async (req, res) => {
  console.log('bodybody', req.body, req.params.id);
  let user = await User.findOneAndUpdate({ _id: req.params.id }, req.body);
  console.log('findOneAndUpdate');
  if (!user) return res.status(404).send('The user with the given ID was not found.');
  user = await User.findOne({ _id: req.params.id });
  console.log({ user }); user
  const jwt = user.generateAuthToken()
  res.send(jwt);
})

module.exports = router;