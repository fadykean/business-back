const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log('hereeee auth', req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log({ error });
  let user = await User.findOne({ email: req.body.email });
  console.log({ user });
  if (!user) return res.status(400).send('Invalid email or password.');
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  res.json({ token: user.generateAuthToken() });
});

function validate(req) {

  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
  });

  return schema.validate(req);
}

module.exports = router;