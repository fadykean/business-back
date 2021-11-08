const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const { number } = require('@hapi/joi');

const cardSchema = new mongoose.Schema({
  bizName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  bizDescription: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024
  },
  bizAddress: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 400
  },
  bizPhone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10
  },
  bizImage: {
    type: String,
    required: false,
    minlength: 0,
    maxlength: 1024
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 99999999999,
    unique: true
  },
  category: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 99999999999,
    unique: false
  },
  rate: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 99999999999,
    unique: false
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Card = mongoose.model('Card', cardSchema);

function validateCard(card) {

  const schema = Joi.object({
    bizName: Joi.string().min(2).max(255).required(),
    bizDescription: Joi.string().min(2).max(1024).required(),
    bizAddress: Joi.string().min(2).max(400).required(),
    bizPhone: Joi.string().min(9).max(10).required().regex(/^0[2-9]\d{7,8}$/),
    bizImage: Joi.string().min(0).max(1024),
    category: Joi.string().min(2).max(1024).required(),
    rate: Joi.number().min(0).max(5).required()
  });

  return schema.validate(card);
}

async function generateBizNumber(Card) {

  while (true) {
    let randomNumber = _.random(1000, 999999);
    let card = await Card.findOne({ bizNumber: randomNumber });
    if (!card) return String(randomNumber);
  }

}

exports.Card = Card;
exports.validateCard = validateCard;
exports.generateBizNumber = generateBizNumber;